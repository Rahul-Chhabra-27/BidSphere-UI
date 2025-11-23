"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
}

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryName = decodeURIComponent(params.categoryName as string);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const toastId = toast.loading("Loading products...");

    fetch(
      `http://localhost:8080/products/category/${encodeURIComponent(
        categoryName
      )}/`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || []);
        toast.success("Products loaded!", { id: toastId });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load products!", { id: toastId });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryName]);

  return (
    <div className="p-6 space-y-4">
      <Button variant="outline" onClick={() => router.push("/categories")}>
        ← Back
      </Button>

      <h1 className="text-2xl font-bold">{categoryName}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No items available in this category</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-sm text-gray-500 line-clamp-2">
                {product.description || "No description"}
              </p>
              <p className="text-blue-600 font-bold mt-2">
                ₹{Number(product.price).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Stock: {product.stock ?? "N/A"}
              </p>
              <Button className="mt-3 w-full bg-blue-600 text-white">
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
