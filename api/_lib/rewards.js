import { getStripe, invalid } from './store.js';

async function loyaltyCoupon(stripe) {
  const id = process.env.CAVERO_REWARD_COUPON_ID || 'cavero-loyalty-20';
  let coupon;
  try {
    coupon = await stripe.coupons.retrieve(id);
  } catch (error) {
    if (error.code !== 'resource_missing') throw error;
    try {
      coupon = await stripe.coupons.create({
        id, name: 'CAVERO — 20% na próxima encomenda',
        percent_off: 20, duration: 'once', metadata: { store: 'cavero' }
      }, { idempotencyKey: 'cavero:loyalty-coupon:v1' });
    } catch (createError) {
      if (createError.code !== 'resource_already_exists') throw createError;
      coupon = await stripe.coupons.retrieve(id);
    }
  }
  if (!coupon.valid || coupon.percent_off !== 20 || coupon.duration !== 'once') throw new Error('O cupão de fidelização CAVERO não está configurado corretamente.');
  return coupon;
}

export async function issueReward(session) {
  if (session.payment_status !== 'paid' || !session.customer) return null;
  const stripe = getStripe();
  const coupon = await loyaltyCoupon(stripe);
  const code = `CAVERO${session.id.slice(-12).toUpperCase()}`;
  const existing = await stripe.promotionCodes.list({ code, limit: 100 });
  const issued = existing.data.find(p => p.metadata?.source_session === session.id && p.customer === session.customer);
  if (issued) return issued;
  try {
    return await stripe.promotionCodes.create({
      promotion: { type: 'coupon', coupon: coupon.id },
      code, customer: session.customer, max_redemptions: 1,
      metadata: { store: 'cavero', source_session: session.id }
    }, { idempotencyKey: `cavero:reward:${session.id}:v1` });
  } catch (error) {
    if (error.code !== 'resource_already_exists') throw error;
    const retry = await stripe.promotionCodes.list({ code, limit: 100 });
    const reward = retry.data.find(p => p.metadata?.source_session === session.id && p.customer === session.customer);
    if (reward) return reward;
    throw error;
  }
}

export async function validateReward(code, email) {
  if (!code) return null;
  if (typeof code !== 'string' || !/^[A-Za-z0-9_-]{4,64}$/.test(code)) throw invalid('Código de desconto inválido.');
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw invalid('Indica o email da compra anterior para utilizar o desconto.');
  const stripe = getStripe();
  const matches = await stripe.promotionCodes.list({ code, active: true, limit: 100 });
  const promotion = matches.data.find(p => p.metadata?.store === 'cavero' && p.customer);
  if (!promotion) throw invalid('Este código não está disponível.');
  const customer = await stripe.customers.retrieve(promotion.customer);
  if (customer.deleted || !customer.email || customer.email.toLowerCase() !== email.trim().toLowerCase()) throw invalid('O código pertence a outro cliente.');
  if (promotion.max_redemptions !== null && promotion.times_redeemed >= promotion.max_redemptions) throw invalid('Este código já foi utilizado.');
  return { promotion, customer };
}
