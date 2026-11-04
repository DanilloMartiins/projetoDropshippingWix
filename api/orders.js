// Endpoint serverless para consultar pedidos da loja Wix eCommerce
// Roda na Vercel Serverless Functions

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.VITE_WIX_API_KEY;
  const siteId = process.env.VITE_WIX_SITE_ID;

  if (!apiKey || !siteId) {
    return res.status(500).json({ error: 'Credenciais da Wix não configuradas' });
  }

  const headers = {
    'Authorization': apiKey,
    'wix-site-id': siteId,
    'Content-Type': 'application/json',
    'Connection': 'keep-alive'
  };

  try {
    const response = await fetch('https://www.wixapis.com/ecom/v1/orders/search', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        search: {
          paging: { limit: 20 }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Erro ao buscar pedidos na Wix', details: errorText });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      orders: data.orders || []
    });
  } catch (error) {
    console.error('Erro na API de pedidos:', error);
    return res.status(500).json({ error: error.message });
  }
}
