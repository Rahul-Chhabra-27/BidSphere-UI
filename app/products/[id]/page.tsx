"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/app/services/service";
import { useCart } from "@/app/context/cartContext";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const { refreshCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const toastId = toast.loading("Loading product...");

    fetch(`http://localhost:8080/products/${productId}/`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        toast.success("Product loaded", { id: toastId });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load product", { id: toastId });
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = () => {
    const userIdRaw = localStorage.getItem("userId");
    const userId = userIdRaw ? Number(userIdRaw) : 0;

    if (!userId) {
      toast.error("Please login to add to cart");
      return;
    }

    addToCart(userId, product);
    refreshCart();
    toast.success("Added to cart");
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!product) return <p className="text-center mt-6">Product not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-blue-600">{product.name}</h1>
      <p className="text-gray-700">{product.description || "No description available"}</p>

      <div className="flex items-center gap-6 mt-4">
        <p className="text-xl font-bold text-green-600">₹{product.price}</p>
        <p className={`text-sm ${product.stock > 0 ? "text-gray-700" : "text-red-500"}`}>
          {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
        </p>
      </div>

      <Button
        className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
        disabled={product.stock === 0}
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  );
}
