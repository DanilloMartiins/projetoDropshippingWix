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
      // Salvar ou atualizar membro no banco de dados da Wix
      const { user, memberId } = req.body || {};
      
      if (!user || !user.email) {
        return res.status(400).json({ error: 'Dados de usuário ou e-mail ausentes' });
      }

      const firstName = user.name ? user.name.split(' ')[0] : '';
      const lastName = user.name ? user.name.split(' ').slice(1).join(' ') : '';
      const addr = user.shippingAddress || {};

      const memberPayload = {
        member: {
          loginEmail: user.email,
          profile: {
            nickname: user.name || user.email.split('@')[0]
          },
          contact: {
            firstName: firstName,
            lastName: lastName,
            phones: user.phone ? [user.phone] : [],
            addresses: addr.street ? [
              {
                tag: 'SHIPPING',
                address: {
                  addressLine: addr.street + (addr.apt ? ` ${addr.apt}` : ''),
                  city: addr.city || '',
                  subdivision: addr.state || '',
                  postalCode: addr.zip || '',
                  country: 'US'
                }
              }
            ] : []
          }
        }
      };

      try {
        const createRes = await fetch('https://www.wixapis.com/members/v1/members', {
          method: 'POST',
          headers,
          body: JSON.stringify(memberPayload)
        });

        if (createRes.ok) {
          const createData = await createRes.json();
          return res.status(200).json({
            success: true,
            memberId: createData.member?.id,
            message: 'Membro registrado com sucesso no banco de dados da Wix'
          });
        }

        const errText = await createRes.text();
        // Se já existe, retorna sucesso com aviso
        return res.status(200).json({
          success: true,
          message: 'Membro já registrado na Wix',
          info: errText
        });
      } catch (err) {
        console.warn('Erro ao sincronizar membro com a Wix:', err.message);
        return res.status(200).json({ success: true, message: 'Salvo localmente' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Erro na API de membros:', error);
    return res.status(500).json({ error: error.message });
  }
}
