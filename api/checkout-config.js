import { getStripe, assertStoreAccount, publicKey, stripeMode, json, fail } from './_lib/store.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Método não permitido.' });
  try {
    const stripe = getStripe();
    await assertStoreAccount(stripe);
    return json(res, 200, { publishableKey: publicKey(), mode: stripeMode(), currency: 'eur' });
  } catch (error) { return fail(res, error); }
}
