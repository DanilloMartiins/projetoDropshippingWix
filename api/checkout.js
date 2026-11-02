// Endpoint serverless para criar checkout na Wix eCommerce API
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

  if (!apiKey || !siteId) {
    return res.status(500).json({ error: 'Credenciais da Wix não configuradas no ambiente' });
  }

  const { cartItems, buyerEmail } = req.body || {};

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Carrinho vazio' });
  }

  const headers = {
    'Authorization': apiKey,
    'wix-site-id': siteId,
    'Content-Type': 'application/json'
  };

  try {
    // Monta os itens do catálogo da Wix Stores
    const lineItems = cartItems.map(item => {
      const p = item.product;
      // Se tiver ID da Wix (GUID), vincula ao catálogo oficial da loja
      if (p.id && p.id.includes('-')) {
        return {
          quantity: item.quantity,
          catalogReference: {
            appId: '215238eb-22a5-4c36-9e7b-e7c08025e04e', // Wix Stores App ID padrão
            catalogItemId: p.id
          }
        };
      }
      return null;
    }).filter(Boolean);

    // Se todos forem itens válidos do catálogo da Wix
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
          checkoutId,
          checkoutUrl: `https://www.${storeDomain}/cart?checkoutId=${checkoutId}`
        });
      }
    }

    // Fallback gracioso para a página de carrinho hospedada da loja
    return res.status(200).json({
      success: true,
      checkoutUrl: `https://www.${storeDomain}/cart`
    });

  } catch (error) {
    console.error('Erro ao processar checkout Wix:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      checkoutUrl: `https://www.${storeDomain}/cart`
    });
  }
}
