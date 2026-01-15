import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  logout: () => set({ user: null }),
}))

export const useInventoryStore = create((set) => ({
  products: [],
  warehouses: [],
  stock: [],
  movements: [],
  adjustments: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setWarehouses: (warehouses) => set({ warehouses }),
  setStock: (stock) => set({ stock }),
  setMovements: (movements) => set({ movements }),
  setAdjustments: (adjustments) => set({ adjustments }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))

export const useUIStore = create((set) => ({
  showModal: false,
  modalType: null,
  selectedItem: null,
  notification: null,

  openModal: (type, item = null) => set({ showModal: true, modalType: type, selectedItem: item }),
  closeModal: () => set({ showModal: false, modalType: null, selectedItem: null }),
  showNotification: (message, type = 'info') => set({ notification: { message, type } }),
  clearNotification: () => set({ notification: null }),
}))
