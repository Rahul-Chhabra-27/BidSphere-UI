"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Smartphone,
  Laptop,
  Sofa,
  Car,
  Home,
  Dumbbell,
  Book,
} from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
}

const iconMapping: Record<string, any> = {
  "Mobiles & Tablets": Smartphone,
  Electronics: Smartphone,
  "Laptops & Computers": Laptop,
  Furniture: Sofa,
  Vehicles: Car,
  "Home Appliances": Home,
  "Sports & Fitness": Dumbbell,
  "Books & Stationery": Book,
  Gaming: Smartphone,
  Fashion: Smartphone,
  Furnitures: Sofa,
};

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToast = toast.loading("Fetching categories...");

    fetch("http://localhost:8000/categories/")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data || []);
        toast.success("Categories loaded!", { id: loadToast });
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load categories!", { id: loadToast });
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-8">Loading categories...</p>
    );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Buy & Sell Categories</h1>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((category) => {
          const Icon = iconMapping[category.name] || Smartphone;
          return (
            <div
              key={category.id}
              onClick={() =>
                router.push(`/categories/${encodeURIComponent(category.name)}`)
              }
              className="p-6 border rounded-xl bg-white shadow-md hover:shadow-lg cursor-pointer flex flex-col items-center gap-3 transition"
            >
              <Icon className="h-10 w-10 text-blue-600" />
              <h2 className="text-center font-medium">{category.name}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
