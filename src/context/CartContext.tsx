import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shoe } from './ShoeContext';

export interface CartItem {
  id: string; // unique cart item id (e.g., shoeId-size)
  shoe: Shoe;
  size: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (shoe: Shoe, size: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('tonyiCart');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('tonyiCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (shoe: Shoe, size: number) => {
    setCart(prev => {
      const existingId = `${shoe.id}-${size}`;
      const existing = prev.find(item => item.id === existingId);
      if (existing) {
        return prev.map(item => 
          item.id === existingId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: existingId, shoe, size, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.shoe.price * 1600 * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
