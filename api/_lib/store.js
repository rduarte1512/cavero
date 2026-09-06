import Stripe from 'stripe';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';

const allowedKeys = new Set(['chronos', 'ocean', 'velocity', 'prestige', 'apex']);
const source = readFileSync(new URL('../../data.js', import.meta.url), 'utf8');
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

export function cents(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error('Preço inválido.');
  return Math.round(value * 100);
}
export function resolveCart(input) {
  if (!Array.isArray(input) || !input.length || input.length > 20) throw new Error('Carrinho inválido.');
  const merged = new Map();
  for (const row of input) {
    if (!row || typeof row.id !== 'string' || !/^(chronos|ocean|velocity|prestige|apex):\d+$/.test(row.id)) throw new Error('Produto inválido.');
    if (!Number.isSafeInteger(row.qty) || row.qty < 1 || row.qty > 10) throw new Error('Quantidade inválida.');
    const product = catalog.get(row.id);
    if (!product) throw new Error('O produto selecionado já não está disponível.');
    merged.set(row.id, (merged.get(row.id) || 0) + row.qty);
  }
  const items = [...merged].map(([id, qty]) => {
    if (qty > 10) throw new Error('Quantidade máxima por acabamento: 10.');
    return { ...catalog.get(id), qty };
  });
  if (items.reduce((sum, item) => sum + item.qty, 0) > 20) throw new Error('Máximo de 20 relógios por encomenda.');
  const subtotal = items.reduce((sum, item) => sum + item.unitAmount * item.qty, 0);
  const compareTotal = items.reduce((sum, item) => sum + Math.max(item.unitAmount, item.compareAt) * item.qty, 0);
  if (subtotal <= 0 || subtotal > 1000000) throw new Error('Total da encomenda inválido.');
  return { items, subtotal, compareTotal, savings: Math.max(0, compareTotal - subtotal) };
}
export function cartFingerprint(items, promotionCode = '') {
  return createHash('sha256').update(JSON.stringify({ items: items.map(i => [i.id, i.qty]), promotionCode })).digest('hex');
}
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  const mode = process.env.CAVERO_STRIPE_MODE || 'test';
  if (!['test', 'live'].includes(mode) || !key || !key.startsWith(mode === 'live' ? 'sk_live_' : 'sk_test_')) {
    throw new Error('Stripe não configurada para o ambiente selecionado.');
  }
  return new Stripe(key, { maxNetworkRetries: 2 });
}
export function publicKey() {
  const key = process.env.STRIPE_PUBLISHABLE_KEY;
  const mode = process.env.CAVERO_STRIPE_MODE || 'test';
  if (!key || !key.startsWith(mode === 'live' ? 'pk_live_' : 'pk_test_')) throw new Error('Chave pública Stripe não configurada.');
  return key;
}
export function publicOrigin() {
  const origin = process.env.CAVERO_SITE_URL;
  if (!origin) throw new Error('CAVERO_SITE_URL não configurado.');
  const url = new URL(origin);
  if (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && url.hostname === 'localhost')) throw new Error('URL do site inválido.');
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
