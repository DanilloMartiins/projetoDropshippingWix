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

export async function createCheckout(cartItems) {
  try {
    // 1. Prepare items payload for Wix eCommerce API
    const lineItems = cartItems.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      productId: item.product.id
    }));

    // Redirect para o checkout seguro da loja Wix
    const hostedCheckoutUrl = `https://www.${STORE_DOMAIN}/cart`;

    return {
      success: true,
      checkoutUrl: hostedCheckoutUrl,
      lineItems
    };
  } catch (error) {
    console.error('Failed to create Wix checkout session:', error);
    return {
      success: false,
      error: error.message,
      checkoutUrl: `https://www.${STORE_DOMAIN}/cart`
    };
  }
}

