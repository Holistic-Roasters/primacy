"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { createCart, addToCart } from "@/lib/shopifyCart";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = window.localStorage.getItem("cartId");
    if (id) {
      setCartId(id);
    }
  }, []);

  async function addProduct(variantId: string, quantity: number = 1) {
    setLoading(true);
    try {
      let updatedCart;
      if (!cartId) {
        const res = await createCart(variantId, quantity);
        updatedCart = res.cartCreate.cart;
        setCartId(updatedCart.id);
        window.localStorage.setItem("cartId", updatedCart.id);
      } else {
        const res = await addToCart(cartId, variantId, quantity);
        updatedCart = res.cartLinesAdd.cart;
      }
      setCart(updatedCart);
      setLoading(false);
      return true;
    } catch (e) {
      setLoading(false);
      return false;
    }
  }

  return (
    <CartContext.Provider value={{ cartId, cart, addProduct, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
