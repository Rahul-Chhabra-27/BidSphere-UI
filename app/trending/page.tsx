"use client";

import { useEffect, useState } from "react";
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
  image?: string;
  deal_price: number;
  city?: string;
  discount_percent?: number;
  created_at: string;
}

function timeBasedDiscount(days: number) {
  if (days <= 10) return 0;
  if (days <= 20) return 10;
  if (days <= 30) return 20;
  return 30;
}

function stockBasedDiscount(stock?: number) {
  if (!stock) return 0;
  if (stock < 20) return 0;
  if (stock <= 50) return 5;
  return 10;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshCart } = useCart();

  useEffect(() => {
    const id = toast.loading("Fetching products");

    fetch("http://localhost:8080/products/")
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.data || [];

        const enriched = allProducts.map((p: any) => {
          const days = Math.floor(
            (Date.now() - new Date(p.created_at).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          const discount =
            timeBasedDiscount(days) + stockBasedDiscount(p.stock);

          return {
            ...p,
            discount_percent: discount,
            deal_price: Math.round(p.price * (1 - discount / 100)),
          };
        });

        const filtered = enriched
          .filter((p) => p.discount_percent > 0)
          .sort((a, b) => b.discount_percent - a.discount_percent)
          .slice(0, 10);

        setProducts(filtered);
        toast.success("Products loaded", { id });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load products", { id });
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-orange-600">Trending Deals</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const imgUrl = product.image
            ? `http://localhost:8080${product.image}`
            : "https://via.placeholder.com/300x200?text=No+Image";

          return (
            <div
              key={product.id}
              className="rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={imgUrl}
                  alt={product.name}
                  className="w-full h-44 object-cover"
                />
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                  {product.discount_percent}% OFF
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {product.description}
                </p>

                <p className="text-xs text-black mt-1">
                  {product.city || "Unknown"}
                </p>

                <div className="mt-1">
                  <p className="line-through text-gray-400 text-xs">
                    ₹{product.price}
                  </p>
                  <p className="text-green-600 text-xl font-bold">
                    ₹{product.deal_price}
                  </p>
                </div>

                {product.stock !== undefined && product.stock <= 3 && (
                  <p className="text-xs text-red-500 font-medium">
                    Hurry only {product.stock} left
                  </p>
                )}

                <Button
                  className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => {
                    const userId = Number(localStorage.getItem("userId") || 0);
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
