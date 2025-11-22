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

  const submit = () => {
    if (!formData.name || !formData.price || !formData.category_name || !formData.city || !formData.pincode) {
      toast.error("All fields required");
      return;
    }
    if (formData.pincode.length !== 6) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category_name: formData.category_name,
      city: formData.city,
      pincode: formData.pincode
    };

    const id = toast.loading("Adding product");

    fetch("http://localhost:8080/products/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Product added successfully", { id });
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          category_name: "",
          city: "",
          pincode: ""
        });
      })
      .catch(() => toast.error("Error", { id }));
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Sell Something</h1>

      <Input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Product Name" />
      <Input name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" />
      <Input type="number" name="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" />
      <Input type="number" name="stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="Stock" />

      <select name="category_name" value={formData.category_name} onChange={(e) => setFormData({ ...formData, category_name: e.target.value })} className="border p-3 rounded-md w-full">
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>{c.name}</option>
        ))}
      </select>

      <select name="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="border p-3 rounded-md w-full">
        <option value="">Select City</option>
        {CITIES.map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>

      <Input type="number" name="pincode" maxLength={6} value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} placeholder="Pincode (6 digits)" />

      <Button className="w-full bg-blue-600 text-white" onClick={submit}>
        Add Product
      </Button>
    </div>
  );
}
