// Endpoint serverless para criar checkout (Stripe Oficial + Wix eCommerce)
// Roda na Vercel Serverless Functions

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_WIX_API_KEY;
  const siteId = process.env.VITE_WIX_SITE_ID;
  const storeDomain = process.env.VITE_STORE_DOMAIN || 'thevektorstudio.com';
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  const { cartItems, buyerEmail } = req.body || {};

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Carrinho vazio' });
  }

  // 1. Tenta criar a Checkout Session diretamente na Stripe (se a chave estiver ativa)
  if (stripeKey) {
    try {
      const params = new URLSearchParams();
      params.append('mode', 'payment');
      params.append('success_url', `https://www.${storeDomain}/?payment_success=true&session_id={CHECKOUT_SESSION_ID}`);
      params.append('cancel_url', `https://www.${storeDomain}/`);
      if (buyerEmail) params.append('customer_email', buyerEmail);

      cartItems.forEach((item, index) => {
        params.append(`line_items[${index}][price_data][currency]`, 'usd');
        params.append(`line_items[${index}][price_data][product_data][name]`, item.product.name);
        params.append(`line_items[${index}][price_data][unit_amount]`, Math.round(item.product.price * 100).toString());
        params.append(`line_items[${index}][quantity]`, item.quantity.toString());
      });

      const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (stripeRes.ok) {
        const stripeData = await stripeRes.json();
        if (stripeData.url) {
          return res.status(200).json({
            success: true,
            provider: 'stripe',
            checkoutUrl: stripeData.url
          });
        }
      } else {
        const stripeErr = await stripeRes.json();
        console.warn('Stripe checkout error:', stripeErr);
        return res.status(400).json({
          success: false,
          error: stripeErr.error?.message || 'Stripe account pending verification. Please try again soon.'
        });
      }
    } catch (e) {
      console.warn('Erro ao chamar Stripe:', e.message);
      return res.status(500).json({
        success: false,
        error: e.message
      });
    }
  }

  return res.status(400).json({
    success: false,
    error: 'Payment gateway configuration pending. Please contact support.'
  });
}
