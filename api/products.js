// Endpoint serverless para consultar produtos da Wix Stores (Catalog V3)
// Roda na Vercel (Serverless Function) e protege as credenciais da Wix

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiKey = process.env.VITE_WIX_API_KEY;
  const siteId = process.env.VITE_WIX_SITE_ID;

  if (!apiKey || !siteId) {
    return res.status(500).json({ error: 'Credenciais da Wix não configuradas no ambiente' });
  }

  try {
    const response = await fetch('https://www.wixapis.com/stores/v3/products/query', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'wix-site-id': siteId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paging: { limit: 100 }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'Erro na API da Wix', details: errText });
    }

    const data = await response.json();
    const rawProducts = data.products || [];

    // Mapeamento dos produtos do Catalog V3 para o padrão do front-end
    const formattedProducts = rawProducts.map((p, index) => {
      const priceMin = parseFloat(p.actualPriceRange?.minValue?.amount || 0);
      const priceMax = parseFloat(p.actualPriceRange?.maxValue?.amount || priceMin);
      
      // Imagem principal
      const mainImg = p.media?.main?.image?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';
      
      // Galeria
      const gallery = [mainImg];
      
      // Simulação calculada de compareAtPrice realista para dropshipping
      const comparePrice = +(priceMin * 1.45).toFixed(2);
      const inStock = p.inventory?.availabilityStatus === 'IN_STOCK';
      
      // Categoria amigável
      let category = 'tech-gadgets';
      let categoryLabel = 'Tech & Gadgets';
      const lowerName = (p.name || '').toLowerCase();
      
      if (lowerName.includes('kitchen') || lowerName.includes('hood') || lowerName.includes('blender') || lowerName.includes('grinder')) {
        category = 'smart-kitchen';
        categoryLabel = 'Smart Kitchen';
      } else if (lowerName.includes('phone') || lowerName.includes('charger') || lowerName.includes('mount') || lowerName.includes('protector') || lowerName.includes('power bank')) {
        category = 'phone-accessories';
        categoryLabel = 'Phone Accessories';
      } else if (lowerName.includes('diffuser') || lowerName.includes('battery') || lowerName.includes('tag') || lowerName.includes('slime') || lowerName.includes('thermometer')) {
        category = 'home-essentials';
        categoryLabel = 'Home Essentials';
      }

      // Badges
      let badge = null;
      if (index === 0) badge = 'BEST SELLER';
      else if (index === 1) badge = 'HOT TREND';
      else if (priceMin > 80) badge = 'PREMIUM PICK';
      else if (index % 3 === 0) badge = 'POPULAR';

      // Variantes/Opções se existirem
      const options = (p.options || []).map(opt => ({
        name: opt.name,
        choices: (opt.choicesSettings?.choices || []).map(c => ({
          id: c.choiceId,
          name: c.name,
          inStock: c.inStock
        }))
      }));

      return {
        id: p.id,
        wixId: p.id,
        numericId: p.numericId,
        name: p.name,
        slug: p.slug,
        category,
        categoryLabel,
        price: priceMin,
        priceMax: priceMax,
        compareAtPrice: comparePrice,
        rating: +(4.7 + ((index % 3) * 0.1)).toFixed(1),
        reviewsCount: 80 + ((index * 17) % 150),
        badge,
        isBestSeller: index < 4,
        isSale: true,
        stockLeft: inStock ? (5 + (index % 12)) : 0,
        inStock,
        images: gallery,
        options,
        description: p.name + '. Premium high-grade quality guaranteed by Vektor Studio. Fast USPS 3-7 business days priority shipping across the USA.',
        features: [
          'Authentic certified quality with 30-day money-back guarantee',
          'Fast US priority shipping (3-7 business days via USPS)',
          'High durability engineered components',
          '24/7 dedicated customer support'
        ]
      };
    });

    return res.status(200).json({
      success: true,
      total: formattedProducts.length,
      products: formattedProducts
    });

  } catch (error) {
    console.error('Erro na função /api/products:', error);
    return res.status(500).json({ error: error.message });
  }
}
