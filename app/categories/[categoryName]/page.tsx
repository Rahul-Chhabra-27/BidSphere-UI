"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  city?: string;
  image?: string;
}

const LOCATIONS = [
  "Mumbai","Delhi","Bengaluru","Hyderabad","Ahmedabad",
  "Chennai","Kolkata","Surat","Pune","Jaipur"
];

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryName = decodeURIComponent(params.categoryName as string);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    setLoading(true);
    const url = `http://localhost:8080/products/category/${encodeURIComponent(categoryName)}/`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching products");
        return res.json();
      })
      .then((data) => {
        const items = data.data || [];
        setAllProducts(items);
        setProducts(items);
        setLoading(false);
      })
      .catch(() => {
        setAllProducts([]);
        setProducts([]);
        setLoading(false);
        toast.error("Failed to load products");
      });
  }, [categoryName]);

  const applyFilters = () => {
    let filtered = [...allProducts];

    if (selectedLocation !== "") {
      filtered = filtered.filter(
        (p) => p.city?.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    if (minPrice !== "") {
      filtered = filtered.filter(
        (p) => Number(p.price) >= Number(minPrice)
      );
    }

    if (maxPrice !== "") {
      filtered = filtered.filter(
        (p) => Number(p.price) <= Number(maxPrice)
      );
    }

    setProducts(filtered);
    toast.success(`Showing ${filtered.length} products`);
  };

  const handlePriceChange = (setFn: (val: string) => void, value: string) => {
    if (Number(value) < 0) return;
    setFn(value);
  };

  const handleClear = () => {
    setSelectedLocation("");
    setMinPrice("");
    setMaxPrice("");

    setProducts(allProducts);

    toast.success("Filters cleared");
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/categories")}>
          🔙 Back
        </Button>
        <h1 className="text-3xl font-bold capitalize">{categoryName}</h1>
      </div>

      <div className="bg-white p-5 rounded-xl border shadow-sm flex flex-wrap gap-6 items-end">

    
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <label className="text-sm font-semibold text-gray-700">Location</label>
          <select
            className="border p-2 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {LOCATIONS.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex flex-col gap-2 w-24">
            <label className="text-sm font-semibold text-gray-700">
              Min Price
            </label>
            <Input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => handlePriceChange(setMinPrice, e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 w-24">
            <label className="text-sm font-semibold text-gray-700">
              Max Price
            </label>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => handlePriceChange(setMaxPrice, e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={applyFilters}
            className="bg-black hover:bg-gray-800 text-white"
          >
            Apply Filters
          </Button>
          <Button
            variant="ghost"
            onClick={handleClear}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading items...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <p className="text-gray-500 font-medium">
            No products match your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const imageUrl = product.image
              ? `http://localhost:8080${product.image}`
              : "/placeholder.png";

            return (
              <div
                key={product.id}
                className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />

                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description || "No description"}
                </p>

                <p className="text-blue-600 font-bold mt-2">
                  ₹{Number(product.price).toFixed(2)}
                </p>

                <p className="text-xs text-gray-500">
                  Location: {product.city || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  Stock: {product.stock ?? "N/A"}
                </p>

                <Button
                  className="mt-3 w-full bg-blue-600 text-white"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  View Details
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
