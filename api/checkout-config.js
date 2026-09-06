import { getStripe, publicKey, json, fail } from './_lib/store.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Método não permitido.' });
  try {
    getStripe();
    return json(res, 200, { publishableKey: publicKey(), mode: process.env.CAVERO_STRIPE_MODE || 'test', currency: 'eur' });
  } catch (error) { return fail(res, error); }
}
