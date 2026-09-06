import { randomUUID } from 'node:crypto';
import { resolveCart, cartFingerprint, getStripe, publicOrigin, requestOrigin, json, fail, invalid } from './_lib/store.js';
import { validateReward } from './_lib/rewards.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método não permitido.' });
  try {
    requestOrigin(req);
    if (!req.is || !req.is('application/json')) throw invalid('Envia um pedido JSON.');
    if (Number(req.headers['content-length'] || 0) > 16384) throw invalid('Pedido demasiado grande.');
    const body = req.body || {};
    const { items, subtotal, compareTotal, savings } = resolveCart(body.items);
    const stripe = getStripe();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw invalid('Email inválido.');
    const reward = await validateReward(body.promotionCode || '', email);
    const requestId = typeof body.requestId === 'string' && /^[0-9a-f-]{36}$/i.test(body.requestId) ? body.requestId : randomUUID();
    const fingerprint = cartFingerprint(items, reward?.promotion.id || '');
    const orderReference = randomUUID();
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur', unit_amount: item.unitAmount, tax_behavior: 'inclusive',
        product_data: {
          name: item.name, description: item.variant,
          metadata: { sku: item.id, store: 'cavero' },
          ...(item.image?.startsWith('https://') ? { images: [item.image] } : {})
        }
      },
      quantity: item.qty
    }));
    lineItems.push({
      price_data: { currency: 'eur', unit_amount: 0, tax_behavior: 'inclusive',
        product_data: { name: 'Pulseira CAVERO — oferta', description: 'Uma pulseira incluída gratuitamente por encomenda.', metadata: { sku: 'bracelet-gift', store: 'cavero' } } },
      quantity: 1
    });
    const metadata = {
      store: 'cavero', order_reference: orderReference,
      cart: items.map(i => `${i.id}x${i.qty}`).join(','), gift_sku: 'bracelet-gift', gift_quantity: '1',
      catalog_subtotal: String(subtotal), catalog_compare_total: String(compareTotal), catalog_savings: String(savings),
      ...(reward ? { promotion_code: reward.promotion.id } : {})
    };
    const params = {
      mode: 'payment', ui_mode: 'embedded', redirect_on_completion: 'if_required',
      return_url: `${publicOrigin()}/checkout/confirmacao?session_id={CHECKOUT_SESSION_ID}`,
      locale: 'pt', currency: 'eur', line_items: lineItems,
      shipping_address_collection: { allowed_countries: ['PT', 'ES'] },
      shipping_options: [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: 0, currency: 'eur' }, display_name: 'Envio gratuito', delivery_estimate: { minimum: { unit: 'day', value: 5 }, maximum: { unit: 'day', value: 13 } } } }],
      billing_address_collection: 'required', phone_number_collection: { enabled: true },
      customer_creation: 'always', invoice_creation: { enabled: true },
      automatic_tax: { enabled: process.env.CAVERO_AUTOMATIC_TAX === 'true' },
      client_reference_id: orderReference, metadata,
      payment_intent_data: { metadata },
      custom_text: {
        shipping_address: { message: 'Envio gratuito. Entrega estimada de 5 a 13 dias.' },
        submit: { message: 'A pulseira de oferta está incluída no total. Os dados de pagamento são tratados pela Stripe.' }
      },
      ...(reward ? { customer: reward.customer.id, discounts: [{ promotion_code: reward.promotion.id }] } : email ? { customer_email: email } : {})
    };
    if (reward) delete params.customer_creation;
    const session = await stripe.checkout.sessions.create(params, {
      idempotencyKey: `cavero:checkout:${requestId}:${fingerprint.slice(0,24)}`
    });
    return json(res, 200, { clientSecret: session.client_secret, sessionId: session.id, orderReference, subtotal, compareTotal, savings, giftQuantity: 1, currency: 'eur' });
  } catch (error) { return fail(res, error); }
}
