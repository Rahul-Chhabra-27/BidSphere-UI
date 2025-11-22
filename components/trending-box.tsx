"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const dummyItems = [
  {
    id: 1,
    title: "iPhone 14 Pro",
    price: "₹68,000",
    location: "Mumbai",
    image: "https://via.placeholder.com/200",
  },
  {
    id: 2,
    title: "Gaming Laptop - RTX 3060",
    price: "₹75,000",
    location: "Delhi",
    image: "https://via.placeholder.com/200",
  },
  {
    id: 3,
    title: "Sofa Set (Brand New)",
    price: "₹12,500",
    location: "Bangalore",
    image: "https://via.placeholder.com/200",
  },
];

export default function TrendingBox() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % dummyItems.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const item = dummyItems[index];

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white border shadow-lg rounded-xl px-6 py-4 max-w-xl w-full text-center mt-6">
        <div className="flex justify-center items-center gap-2 mb-3">
          <Sparkles className="text-yellow-500" />
          <h2 className="text-lg font-semibold">🔥 Trending Deal</h2>
        </div>
        
        <img
          src={item.image}
          alt={item.title}
          className="w-40 h-40 mx-auto rounded-lg object-cover"
        />

        <h3 className="mt-3 font-medium">{item.title}</h3>
        <p className="font-bold text-blue-600">{item.price}</p>
        <p className="text-gray-500 text-sm">{item.location}</p>

        <Button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => alert(`Clicked ${item.title}`)}
        >
          Explore Deal
        </Button>
      </div>
    </div>
  );
}
