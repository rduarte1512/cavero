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
    const session = event.data.object;
    if (session.object !== 'checkout.session' || session.metadata?.store !== 'cavero') return json(res, 200, { received: true });
    const stripe = getStripe();
    if (['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) {
      if (session.payment_status === 'paid') {
        if (session.payment_intent) {
          await stripe.paymentIntents.update(session.payment_intent, {
            metadata: {
              store: 'cavero', order_reference: session.metadata.order_reference,
              cart: session.metadata.cart, gift_sku: 'bracelet-gift', gift_quantity: '1',
              fulfillment_status: 'pending'
            }
          }, { idempotencyKey: `cavero:fulfillment-metadata:${session.id}:v1` });
        }
        await issueReward(session);
        console.info('CAVERO paid order:', JSON.stringify({ session: session.id, order: session.metadata.order_reference, event: event.id }));
      }
    } else if (['checkout.session.async_payment_failed', 'checkout.session.expired'].includes(event.type)) {
      console.info('CAVERO checkout not paid:', JSON.stringify({ session: session.id, event: event.type }));
    }
    return json(res, 200, { received: true });
  } catch (error) {
    console.error('CAVERO webhook processing failed:', error.message);
    return json(res, 500, { error: 'Processamento pendente; a Stripe poderá reenviar o evento.' });
  }
}
