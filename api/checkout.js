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

  const { cartItems, buyerEmail, user } = req.body || {};
  const effectiveEmail = user?.email || buyerEmail;
  const effectiveName = user?.name || '';
  const effectivePhone = user?.phone || '';
  const addr = user?.shippingAddress || {};

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Carrinho vazio' });
  }

  // 1. Tenta criar a Checkout Session diretamente na Stripe (se a chave estiver ativa)
  if (stripeKey) {
    try {
      let customerId = null;

      // Se temos o e-mail do usuário, vincula ou cria o Customer na Stripe com o endereço
      if (effectiveEmail) {
        try {
          const searchRes = await fetch(`https://api.stripe.com/v1/customers?email=${encodeURIComponent(effectiveEmail)}&limit=1`, {
            headers: { 'Authorization': `Bearer ${stripeKey}` }
          });
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            if (searchData.data && searchData.data.length > 0) {
              customerId = searchData.data[0].id;
              
              if (addr && addr.street) {
                const updateParams = new URLSearchParams();
                if (effectiveName) updateParams.append('name', effectiveName);
                if (effectivePhone) updateParams.append('phone', effectivePhone);
                updateParams.append('shipping[name]', effectiveName || 'Valued Customer');
                if (effectivePhone) updateParams.append('shipping[phone]', effectivePhone);
                updateParams.append('shipping[address][line1]', addr.street);
                if (addr.apt) updateParams.append('shipping[address][line2]', addr.apt);
                if (addr.city) updateParams.append('shipping[address][city]', addr.city);
                if (addr.state) updateParams.append('shipping[address][state]', addr.state);
                if (addr.zip) updateParams.append('shipping[address][postal_code]', addr.zip);
                updateParams.append('shipping[address][country]', 'US');

                await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${stripeKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  body: updateParams.toString()
                });
              }
            }
          }
        } catch (e) {
          console.warn('Erro ao buscar customer Stripe:', e.message);
        }

        if (!customerId) {
          try {
            const createCustParams = new URLSearchParams();
            createCustParams.append('email', effectiveEmail);
            if (effectiveName) createCustParams.append('name', effectiveName);
            if (effectivePhone) createCustParams.append('phone', effectivePhone);
            if (addr && addr.street) {
              createCustParams.append('shipping[name]', effectiveName || 'Valued Customer');
              if (effectivePhone) createCustParams.append('shipping[phone]', effectivePhone);
              createCustParams.append('shipping[address][line1]', addr.street);
              if (addr.apt) createCustParams.append('shipping[address][line2]', addr.apt);
              if (addr.city) createCustParams.append('shipping[address][city]', addr.city);
              if (addr.state) createCustParams.append('shipping[address][state]', addr.state);
              if (addr.zip) createCustParams.append('shipping[address][postal_code]', addr.zip);
              createCustParams.append('shipping[address][country]', 'US');
            }

            const newCustRes = await fetch('https://api.stripe.com/v1/customers', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${stripeKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: createCustParams.toString()
            });
            if (newCustRes.ok) {
              const newCustData = await newCustRes.json();
              customerId = newCustData.id;
            }
          } catch (e) {
            console.warn('Erro ao criar customer Stripe:', e.message);
          }
        }
      }

      const params = new URLSearchParams();
      params.append('mode', 'payment');
      params.append('allow_promotion_codes', 'true');
      params.append('success_url', `https://www.${storeDomain}/?payment_success=true&session_id={CHECKOUT_SESSION_ID}`);
      params.append('cancel_url', `https://www.${storeDomain}/`);

      if (customerId) {
        params.append('customer', customerId);
        params.append('customer_update[shipping]', 'auto');
      } else if (effectiveEmail) {
        params.append('customer_email', effectiveEmail);
      }

      params.append('shipping_address_collection[allowed_countries][0]', 'US');
      params.append('phone_number_collection[enabled]', 'true');

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
