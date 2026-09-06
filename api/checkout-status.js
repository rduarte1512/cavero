import { getStripe, json, fail, invalid } from './_lib/store.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Método não permitido.' });
  try {
    const id = req.query.session_id;
    if (typeof id !== 'string' || !/^cs_(test_|live_)[A-Za-z0-9]+$/.test(id)) throw invalid('Referência de pagamento inválida.');
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(id);
    if (session.metadata?.store !== 'cavero') throw invalid('Encomenda não encontrada.');
    const lineItems = await stripe.checkout.sessions.listLineItems(id, { limit: 100 });
    const paid = session.payment_status === 'paid';
    return json(res, 200, {
      status: session.status, paymentStatus: session.payment_status,
      paid, orderReference: session.metadata.order_reference,
      amountTotal: session.amount_total, amountSubtotal: session.amount_subtotal,
      currency: session.currency, discountTotal: session.total_details?.amount_discount || 0,
      shippingTotal: session.total_details?.amount_shipping || 0,
      items: lineItems.data.map(item => ({ name: item.description, quantity: item.quantity, amount: item.amount_total })),
      giftQuantity: Number(session.metadata.gift_quantity || 0),
      rewardAvailable: paid && Boolean(session.customer)
    });
  } catch (error) { return fail(res, error); }
}
