import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      
      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({ cart: [...cart, { ...product, quantity }] });
        }
      },
      
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.id !== productId) });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
        } else {
          set({
            cart: get().cart.map(item =>
              item.id === productId ? { ...item, quantity } : item
            )
          });
        }
      },
      
      clearCart: () => set({ cart: [] }),
      
      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          return total + (parseFloat(item.price) * item.quantity);
        }, 0);
      },
      
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
      
      // User state
      user: null,
      token: null,
      
      setUser: (user, token) => {
        set({ user, token });
        if (token) {
          localStorage.setItem('token', token);
        }
      },
      
      logout: () => {
        set({ user: null, token: null, cart: [] });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },
    }),
    {
      name: 'dropship-store',
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
