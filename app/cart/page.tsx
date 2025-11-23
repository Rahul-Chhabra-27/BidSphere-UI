"use client";

import { useCart } from "../context/cartContext";
import { toast } from "sonner";
import Link from "next/link";
import CheckoutButton from "@/components/checkoutButton";

export default function CartPage() {
  const { cart, removeItem, totalAmount } = useCart();

  const handleRemove = (productId: number) => {
    removeItem(productId);
    toast.success("Removed from cart");
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <Link href="/trending" className="text-blue-600 underline mt-4 inline-block">
          Check Trending Deals
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Cart</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white"
        >
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-gray-500 text-sm">₹{item.price} × {item.quantity}</p>
          </div>

          <button
            className="text-sm text-red-600 hover:underline"
            onClick={() => handleRemove(item.id)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="text-right text-lg font-semibold">
        Total: ₹{totalAmount}
      </div>

      <CheckoutButton />
    </div>
  );
}
