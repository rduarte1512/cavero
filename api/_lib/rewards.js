import { getStripe, invalid } from './store.js';

// A reward is issued only after Stripe confirms payment. The promotion code is
// restricted to the paying customer, can be redeemed once, and cannot be stacked.
export async function issueReward(session) {
  if (session.payment_status !== 'paid' || !session.customer) return null;
  const stripe = getStripe();
  let couponId = process.env.CAVERO_REWARD_COUPON_ID;
  if (!couponId) {
    const coupon = await stripe.coupons.create({
      id: 'cavero-loyalty-20', name: 'CAVERO — 20% na próxima encomenda',
      percent_off: 20, duration: 'once', metadata: { store: 'cavero' }
    }, { idempotencyKey: 'cavero:loyalty-coupon:v1' });
    couponId = coupon.id;
  }
  const code = `CAVERO${session.id.slice(-12).toUpperCase()}`;
  return stripe.promotionCodes.create({
    promotion: { type: 'coupon', coupon: couponId },
    code, customer: session.customer, max_redemptions: 1,
    metadata: { store: 'cavero', source_session: session.id }
  }, { idempotencyKey: `cavero:reward:${session.id}:v1` });
}

export async function validateReward(code, email) {
  if (!code) return null;
  if (typeof code !== 'string' || !/^[A-Za-z0-9_-]{4,64}$/.test(code)) throw invalid('Código de desconto inválido.');
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw invalid('Indica o email da compra anterior para utilizar o desconto.');
  const stripe = getStripe();
  const matches = await stripe.promotionCodes.list({ code, active: true, limit: 10 });
  const promotion = matches.data.find(p => p.metadata?.store === 'cavero' && p.customer);
  if (!promotion) throw invalid('Este código não está disponível.');
  const customer = await stripe.customers.retrieve(promotion.customer);
  if (customer.deleted || !customer.email || customer.email.toLowerCase() !== email.trim().toLowerCase()) throw invalid('O código pertence a outro cliente.');
  if (promotion.max_redemptions !== null && promotion.times_redeemed >= promotion.max_redemptions) throw invalid('Este código já foi utilizado.');
  return { promotion, customer };
}
