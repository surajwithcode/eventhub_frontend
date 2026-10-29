import { create } from 'zustand';
import { DEFAULT_PRODUCTS, DEFAULT_BRAND_CONFIG } from '../constants/eventCategories';

export const useAppStore = create((set, get) => ({
  currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
  brandConfig: JSON.parse(localStorage.getItem('eventhub_brand_config') || 'null') || DEFAULT_BRAND_CONFIG,
  productsList: JSON.parse(localStorage.getItem('eventhub_products') || '[]').length > 0
    ? JSON.parse(localStorage.getItem('eventhub_products'))
    : DEFAULT_PRODUCTS,

  setCurrentUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    set({ currentUser: user });
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    set({ currentUser: null });
  },

  setBrandConfig: (config) => {
    localStorage.setItem('eventhub_brand_config', JSON.stringify(config));
    set({ brandConfig: config });
  },

  setProductsList: (products) => {
    localStorage.setItem('eventhub_products', JSON.stringify(products));
    set({ productsList: products });
  }
}));