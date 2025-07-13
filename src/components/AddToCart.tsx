"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";

export function AddToCartActions({
  variants,
  defaultVariantId,
}: {
  variants: any[];
  defaultVariantId: string;
}) {
  const { addProduct, cart, loading } = useCart();

  const [variantId, setVariantId] = useState(defaultVariantId);
  const [qty, setQty] = useState(1);

  return (
    <>
      {variants.length > 1 && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Choose a variant:</label>
          <select
            className="p-2 rounded border bg-[var(--color-surface)] text-white"
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-4 items-end mb-8">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-16 p-2 rounded border border-[var(--color-border)] bg-[var(--color-black)] text-white"
        />
        <button
          onClick={() => addProduct(variantId, qty)}
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-[var(--color-accent)] text-black font-display font-semibold uppercase tracking-wide hover:bg-[var(--color-accent-hover)] transition"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
        <button
          onClick={() => {
            if (cart?.checkoutUrl) {
              window.open(cart.checkoutUrl, "_blank");
            }
          }}
          className="px-6 py-3 rounded-lg border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-display font-semibold uppercase tracking-wide bg-transparent hover:bg-[var(--color-accent)] hover:text-black transition"
        >
          Buy Now
        </button>
      </div>
    </>
  );
}
