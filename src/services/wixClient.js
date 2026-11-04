/**
 * Wix Headless eCommerce Client
 * Connects Vektor Studio Front-End with Wix Stores Backend & Checkout
 */

import { PRODUCTS } from '../data/products';

const STORE_DOMAIN = import.meta.env.VITE_STORE_DOMAIN || 'thevektorstudio.com';

/**
 * Busca produtos dinâmicos vindos da API da Wix (Catalog V3)
 * com fallback inteligente para os produtos base caso a API oscile
 */
export async function fetchWixProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    if (data.success && Array.isArray(data.products) && data.products.length > 0) {
      return data.products;
    }
    return PRODUCTS;
  } catch (error) {
    console.warn('Usando catálogo fallback de contingência:', error.message);
    return PRODUCTS;
  }
}

export async function createCheckout(cartItems, userOrEmail = '') {
  try {
    const buyerEmail = typeof userOrEmail === 'string' ? userOrEmail : (userOrEmail?.email || '');
    const user = typeof userOrEmail === 'object' ? userOrEmail : null;

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cartItems, buyerEmail, user })
    });

    const data = await res.json();
    if (res.ok && data.success && data.checkoutUrl) {
      return data;
    }

    return {
      success: false,
      error: data.error || 'Failed to initiate checkout session'
    };
  } catch (error) {
    console.error('Erro ao chamar /api/checkout:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

