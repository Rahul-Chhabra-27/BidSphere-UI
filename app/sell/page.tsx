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
    fetch("http://localhost:8000/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  const handleNonNegativeInput = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const val = e.target.value;
    if (val === "") {
        setFormData({ ...formData, [field]: "" });
        return;
    }
    if (Number(val) < 0) return;
    setFormData({ ...formData, [field]: val });
  };

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
      location: formData.city,
    };

    const id = toast.loading("Adding product");
    console.log(payload)
    fetch("http://localhost:8080/products/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to add");
        return res.json();
      })
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
      })
      .catch(() => toast.error("Failed to add product", { id }));
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800">Sell Something</h1>

      <div className="space-y-4">
        <div>
            <label className="text-sm font-medium text-gray-700">Product Name</label>
            <Input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Vintage Camera" />
        </div>
        
        <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Input name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe your item..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                <Input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={(e) => handleNonNegativeInput(e, "price")} 
                    placeholder="0.00" 
                    min="0"
                />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Stock</label>
                <Input 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={(e) => handleNonNegativeInput(e, "stock")} 
                    placeholder="1" 
                    min="0"
                />
            </div>
        </div>

        <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select name="category_name" value={formData.category_name} onChange={(e) => setFormData({ ...formData, category_name: e.target.value })} className="border p-2 rounded-md w-full bg-white focus:ring-2 focus:ring-black outline-none">
                <option value="">Select Category</option>
                {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
                ))}
            </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-gray-700">City</label>
                <select name="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="border p-2 rounded-md w-full bg-white focus:ring-2 focus:ring-black outline-none">
                    <option value="">Select City</option>
                    {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700">Pincode</label>
                <Input 
                    type="number" 
                    name="pincode" 
                    maxLength={6} 
                    value={formData.pincode} 
                    onChange={(e) => handleNonNegativeInput(e, "pincode")} 
                    placeholder="6 digits" 
                    min="0"
                />
            </div>
        </div>

        <Button className="w-full bg-black hover:bg-gray-800 text-white h-12 text-lg" onClick={submit}>
            List Item for Sale
        </Button>
      </div>
    </div>
  );
}