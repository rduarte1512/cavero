import Stripe from 'stripe';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';

const allowedKeys = new Set(['chronos', 'ocean', 'velocity', 'prestige', 'apex', 'mariner']);
const source = [
  readFileSync(new URL('../../data.js', import.meta.url), 'utf8'),
  readFileSync(new URL('../../mariner-data.js', import.meta.url), 'utf8')
].join('\n');
// Read the version-controlled catalogue in a restricted context. The browser never supplies prices.
const families = runInNewContext(source + '\n;families;', Object.create(null), { timeout: 1000 });
const catalog = new Map();
for (const family of families) {
  if (!allowedKeys.has(family.key)) continue;
  family.variants.forEach((variant, index) => {
    const v = Array.isArray(variant) ? { name: variant[0], price: variant[1], compareAt: variant[2], image: variant[3] } : variant;
    catalog.set(`${family.key}:${index}`, {
      id: `${family.key}:${index}`, name: family.name, variant: v.name,
      unitAmount: cents(v.price), compareAt: cents(v.compareAt), image: v.image
    });
  });
}

const MARINER_CAMPAIGN_END = Date.parse('2026-10-10T23:59:59+01:00');
function currentCatalogProduct(product) {
  if (!product) return product;
  if (product.id === 'mariner:0' && Date.now() > MARINER_CAMPAIGN_END) {
    return { ...product, unitAmount: 10999, compareAt: 10999 };
  }
  return product;
}

export function cents(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error('Preço inválido.');
  return Math.round(value * 100);
}
export function resolveCart(input) {
  if (!Array.isArray(input) || !input.length || input.length > 20) throw invalid('Carrinho inválido.');
  const merged = new Map();
  for (const row of input) {
    if (!row || typeof row.id !== 'string' || !/^(chronos|ocean|velocity|prestige|apex|mariner):\d+$/.test(row.id)) throw invalid('Produto inválido.');
    if (!Number.isSafeInteger(row.qty) || row.qty < 1 || row.qty > 10) throw invalid('Quantidade inválida.');
    const product = currentCatalogProduct(catalog.get(row.id));
    if (!product) throw invalid('O produto selecionado já não está disponível.');
    merged.set(row.id, (merged.get(row.id) || 0) + row.qty);
  }
  const items = [...merged].map(([id, qty]) => {
    if (qty > 10) throw invalid('Quantidade máxima por acabamento: 10.');
    return { ...currentCatalogProduct(catalog.get(id)), qty };
  });
  if (items.reduce((sum, item) => sum + item.qty, 0) > 20) throw invalid('Máximo de 20 relógios por encomenda.');
  const subtotal = items.reduce((sum, item) => sum + item.unitAmount * item.qty, 0);
  const compareTotal = items.reduce((sum, item) => sum + Math.max(item.unitAmount, item.compareAt) * item.qty, 0);
  if (subtotal <= 0 || subtotal > 1000000) throw invalid('Total da encomenda inválido.');
  return { items, subtotal, compareTotal, savings: Math.max(0, compareTotal - subtotal) };
}
export function cartFingerprint(items, promotionCode = '') {
  return createHash('sha256').update(JSON.stringify({ items: items.map(i => [i.id, i.qty]), promotionCode })).digest('hex');
}
export function stripeMode() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  const inferred = /^(?:sk|rk)_(test|live)_\S+$/.exec(key || '')?.[1];
  if (!inferred) throw new Error('STRIPE_SECRET_KEY ausente ou inválida.');
  const configured = process.env.CAVERO_STRIPE_MODE?.trim();
  if (configured && configured !== inferred) throw new Error('CAVERO_STRIPE_MODE não corresponde à chave Stripe configurada.');
  return inferred;
}
export function getStripe() {
  stripeMode();
  return new Stripe(process.env.STRIPE_SECRET_KEY.trim(), { maxNetworkRetries: 2 });
}
export function publicKey() {
  const key = process.env.STRIPE_PUBLISHABLE_KEY?.trim();
  const mode = stripeMode();
  if (!key || !key.startsWith(mode === 'live' ? 'pk_live_' : 'pk_test_')) throw new Error('Chave pública Stripe não configurada.');
  return key;
}
export function publicOrigin() {
  const origin = process.env.CAVERO_SITE_URL?.trim() || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://caverowatches.vercel.app');
  if (!origin) throw new Error('CAVERO_SITE_URL não configurado.');
  const url = new URL(origin);
  if (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && url.hostname === 'localhost')) throw new Error('URL do site inválido.');
  // Migrate the previous production address even when its environment value is stale.
  if (url.origin === 'https://cavero-three.vercel.app') return 'https://caverowatches.vercel.app';
  return url.origin;
}
export function requestOrigin(req) {
  const expected = publicOrigin();
  const supplied = req.headers.origin;
  if (supplied && supplied !== expected) throw Object.assign(new Error('Origem não autorizada.'), { status: 403 });
  return expected;
}
export function json(res, status, payload) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(status).json(payload);
}
export function fail(res, error) {
  const status = error.status || (error.type === 'StripeInvalidRequestError' ? 400 : 500);
  if (status >= 500) console.error('CAVERO checkout:', error.message);
  json(res, status, { error: status >= 500 ? 'Não foi possível processar o pedido. Tenta novamente.' : error.message });
}
export function invalid(message) { return Object.assign(new Error(message), { status: 400 }); }
export const gift = { id: 'bracelet-gift', name: 'Pulseira CAVERO', unitAmount: 0, qty: 1 };

export async function assertStoreAccount(stripe) {
  const expected = process.env.CAVERO_STRIPE_ACCOUNT_ID;
  if (!expected || !/^acct_[A-Za-z0-9]+$/.test(expected)) throw new Error('Configura o ID da conta Stripe exclusiva da CAVERO.');
  const account = await stripe.accounts.retrieve();
  if (account.id !== expected) throw new Error('As chaves Stripe não pertencem à conta CAVERO configurada.');
  if (stripeMode() === 'live' && account.charges_enabled !== true) throw new Error('A conta Stripe ainda não está autorizada a receber pagamentos.');
  if (process.env.CAVERO_CHECKOUT_ENABLED !== 'true') throw new Error('O checkout ainda não foi ativado pelo proprietário da loja.');
  publicOrigin();
  return account;
}
