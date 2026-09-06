import { getStripe, requestOrigin, json, fail, invalid } from './_lib/store.js';
import { issueReward } from './_lib/rewards.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método não permitido.' });
  try {
    requestOrigin(req);
    const id = req.body?.sessionId;
    if (typeof id !== 'string' || !/^cs_(test_|live_)[A-Za-z0-9]+$/.test(id)) throw invalid('Referência inválida.');
    const session = await getStripe().checkout.sessions.retrieve(id);
    if (session.metadata?.store !== 'cavero' || session.payment_status !== 'paid') throw invalid('O pagamento ainda não está confirmado.');
    const reward = await issueReward(session);
    return json(res, 200, { code: reward.code, percentOff: 20, message: '20% de desconto na próxima encomenda. Código de utilização única, associado ao cliente que efetuou a compra.' });
  } catch (error) { return fail(res, error); }
}
