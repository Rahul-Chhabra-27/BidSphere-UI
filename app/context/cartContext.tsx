"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCart, saveCart } from "../services/service";


interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  cartCount: 0,
  totalAmount: 0,
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  refreshCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const refreshCart = () => {
    const userId = Number(localStorage.getItem("userId"));
    const storedCart = getCart(userId);
    setCart(storedCart);
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const addItem = (item: CartItem) => {
    const userId = Number(localStorage.getItem("userId"));
    const updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex((i) => i.id === item.id);

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity += item.quantity;
    } else {
      updatedCart.push(item);
    }

    setCart(updatedCart);
    saveCart(userId, updatedCart);
  };

  const removeItem = (productId: number) => {
    const userId = Number(localStorage.getItem("userId"));
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    saveCart(userId, updatedCart);
  };

  const clearCart = () => {
    const userId = Number(localStorage.getItem("userId"));
    setCart([]);
    saveCart(userId, []);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        totalAmount,
        addItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
