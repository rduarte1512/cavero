import { getStripe, json } from './_lib/store.js';
import { issueReward } from './_lib/rewards.js';

export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 2 * 1024 * 1024) throw new Error('Webhook demasiado grande.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método não permitido.' });
  let event;
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret || !secret.startsWith('whsec_')) throw new Error('Webhook secret não configurado.');
    event = getStripe().webhooks.constructEvent(await rawBody(req), req.headers['stripe-signature'], secret);
  } catch (error) {
    console.warn('CAVERO webhook rejeitado:', error.message);
    return json(res, 400, { error: 'Assinatura ou payload inválido.' });
  }
  try {
    if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed', 'checkout.session.expired'].includes(event.type)) return json(res, 200, { received: true });
    const stripe = getStripe();
    const eventSession = event.data.object;
    if (eventSession.object !== 'checkout.session' || eventSession.metadata?.store !== 'cavero') return json(res, 200, { received: true });
    const session = await stripe.checkout.sessions.retrieve(eventSession.id);
    if (session.metadata?.store !== 'cavero') return json(res, 200, { received: true });
    if (['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type) && session.payment_status === 'paid') {
      if (session.payment_intent) {
        const pi = await stripe.paymentIntents.retrieve(session.payment_intent);
        if (pi.status !== 'succeeded') throw new Error('O PaymentIntent ainda não foi confirmado.');
        if (pi.metadata.store && pi.metadata.store !== 'cavero') throw new Error('PaymentIntent de outra loja.');
        const metadata = {
          ...pi.metadata, store: 'cavero', order_reference: session.metadata.order_reference,
          cart: session.metadata.cart, gift_sku: 'bracelet-gift', gift_quantity: '1',
          fulfillment_status: pi.metadata.fulfillment_status || 'pending'
        };
        await stripe.paymentIntents.update(pi.id, { metadata }, { idempotencyKey: `cavero:fulfillment-metadata:${session.id}:v1` });
      }
      const reward = await issueReward(session);
      if (reward && session.metadata.reward_code !== reward.code) {
        await stripe.checkout.sessions.update(session.id, {
          metadata: { ...session.metadata, reward_code: reward.code, reward_id: reward.id }
        }, { idempotencyKey: `cavero:reward-record:${session.id}:v1` });
      }
      console.info('CAVERO paid order:', JSON.stringify({ session: session.id, order: session.metadata.order_reference, event: event.id }));
    } else if (['checkout.session.async_payment_failed', 'checkout.session.expired'].includes(event.type)) {
      console.info('CAVERO checkout not paid:', JSON.stringify({ session: session.id, event: event.type }));
    }
    return json(res, 200, { received: true });
  } catch (error) {
    console.error('CAVERO webhook processing failed:', error.message);
    return json(res, 500, { error: 'Processamento pendente; a Stripe poderá reenviar o evento.' });
  }
}
