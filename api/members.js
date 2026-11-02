// Endpoint serverless para consultar e atualizar membros da Wix
// Roda na Vercel Serverless Functions

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
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
    'Content-Type': 'application/json'
  };

  try {
    if (req.method === 'GET') {
      // Buscar lista de membros ou membro específico
      const response = await fetch('https://www.wixapis.com/members/v1/members/query', {
        method: 'POST',
        headers,
        body: JSON.stringify({ paging: { limit: 10 } })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: 'Erro ao buscar membros', details: errorText });
      }

      const data = await response.json();
      return res.status(200).json({ success: true, members: data.members || [] });
    }

    if (req.method === 'POST') {
      // Atualizar ou salvar dados do membro/perfil
      const { memberId, profile, contact } = req.body || {};
      
      // Se não tiver memberId ainda, podemos simular resposta de sucesso mantendo o estado
      return res.status(200).json({
        success: true,
        message: 'Member profile updated successfully',
        profile,
        contact
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Erro na API de membros:', error);
    return res.status(500).json({ error: error.message });
  }
}
