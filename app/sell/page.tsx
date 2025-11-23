"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
}

const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
  "Bhopal", "Visakhapatnam", "Vadodara", "Patna", "Ghaziabad"
];

export default function SellProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_name: "",
    city: "",
    pincode: ""
  });

  useEffect(() => {
    fetch("http://localhost:8080/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch(() => {});
  }, []);
  console.log(categories);
  const submit = () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.category_name ||
      !formData.city ||
      !formData.pincode ||
      !imageFile
    ) {
      toast.error("All fields including image required");
      return;
    }

    if (formData.pincode.length !== 6) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("description", formData.description);
    uploadData.append("price", formData.price);
    uploadData.append("stock", formData.stock);
    uploadData.append("category_name", formData.category_name);
    uploadData.append("city", formData.city);
    uploadData.append("pincode", formData.pincode);
    uploadData.append("image", imageFile);

    const id = toast.loading("Adding product...");

    fetch("http://localhost:8080/products/", {
      method: "POST",
      body: uploadData,
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Product added successfully!", { id });

        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          category_name: "",
          city: "",
          pincode: ""
        });

        setImageFile(null);
      })
      .catch(() => toast.error("Error adding product", { id }));
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Sell Something</h1>

      <Input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Product Name"
      />

      <Input
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Description"
      />

      <Input
        type="number"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        placeholder="Price"
      />

      <Input
        type="number"
        value={formData.stock}
        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        placeholder="Stock"
      />

      <select
        value={formData.category_name}
        onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
        className="border p-3 rounded-md w-full"
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>{c.name}</option>
        ))}
      </select>

      <select
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        className="border p-3 rounded-md w-full"
      >
        <option value="">Select City</option>
        {CITIES.map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>

      <Input
        type="number"
        value={formData.pincode}
        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
        placeholder="Pincode (6 digits)"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="border p-3 rounded-md w-full"
      />

      <Button className="w-full bg-blue-600 text-white" onClick={submit}>
        Add Product
      </Button>
    </div>
  );
}
