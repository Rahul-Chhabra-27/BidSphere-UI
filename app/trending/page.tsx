"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addToCart } from "../services/service";
import { useCart } from "../context/cartContext";
interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
  description?: string;
  deal_price: number;
  city?: string;
  discount_percent?: number;
}

export default function TrendingDealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshCart } = useCart();
  useEffect(() => {
    const id = toast.loading("Fetching trending deals");

    fetch("http://localhost:8080/products/")
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.data || [];
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        const enriched = selected.map((p: any) => ({
          ...p,
          deal_price: Math.round(Number(p.price) * 0.8),
          discount_percent: 20,
        }));
        setProducts(enriched);
        toast.success("Deals loaded", { id });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load deals", { id });
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-orange-600">Trending Deals</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const limitedStock =
            product.stock !== undefined && product.stock <= 3;
          return (
            <div
              key={product.id}
              className="rounded-xl p-5 bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-lg">
                  {product.discount_percent}% off
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {product.description}
              </p>

              <div className="mt-3 text-xs text-gray-700">
                {product.city ? product.city : "Location not specified"}
              </div>

              <div className="mt-4">
                <p className="line-through text-gray-400 text-xs">
                  ₹{product.price}
                </p>
                <p className="text-green-600 text-xl font-bold">
                  ₹{product.deal_price}
                </p>
                {limitedStock ? (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    Only {product.stock} left
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">In stock</p>
                )}
              </div>

              <Button
                className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => {
                  const userIdRaw = localStorage.getItem("userId");
                  const userId = userIdRaw ? Number(userIdRaw) : 0;

                  if (!userId) {
                    toast.error("Please login to add to cart");
                    return;
                  }

                  addToCart(userId, product);
                  refreshCart();
                  toast.success("Added to cart");
                }}
              >
                Add to Cart
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
