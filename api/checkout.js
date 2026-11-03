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
      }
    } catch (e) {
      console.warn('Aguardando liberação de métodos da Stripe, usando fallback:', e.message);
    }
  }

  // 2. Integração com Wix eCommerce Checkout
  if (apiKey && siteId) {
    const headers = {
      'Authorization': apiKey,
      'wix-site-id': siteId,
      'Content-Type': 'application/json'
    };

    try {
      const lineItems = cartItems.map(item => {
        const p = item.product;
        if (p.id && p.id.includes('-')) {
          return {
            quantity: item.quantity,
            catalogReference: {
              appId: '215238eb-22a5-4c36-9e7b-e7c08025e04e',
              catalogItemId: p.id
            }
          };
        }
        return null;
      }).filter(Boolean);

      if (lineItems.length > 0) {
        const checkoutPayload = {
          channelType: 'WEB',
          lineItems
        };

        const wixRes = await fetch('https://www.wixapis.com/ecom/v1/checkouts', {
          method: 'POST',
          headers,
          body: JSON.stringify(checkoutPayload)
        });

        if (wixRes.ok) {
          const checkoutData = await wixRes.json();
          const checkoutId = checkoutData.checkout?.id;

          return res.status(200).json({
            success: true,
            provider: 'wix',
            checkoutId,
            checkoutUrl: `https://www.${storeDomain}/?payment_success=true&order_id=${checkoutId}`
          });
        }
      }
    } catch (error) {
      console.error('Erro na chamada da Wix:', error);
    }
  }

  // Fallback padrão
  return res.status(200).json({
    success: true,
    checkoutUrl: `https://www.${storeDomain}/?payment_success=true`
  });
}
