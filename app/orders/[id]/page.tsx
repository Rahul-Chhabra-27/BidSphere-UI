"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/order/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(res => res.json())
      .then(data => setOrder(data.order))
      .catch(() => toast.error("Failed to load order"));
  }, [id]);

  if (!order) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Order #{order.id}</h1>
      <p className="text-gray-600">Status: {order.status}</p>

      <div className="space-y-2">
        {order.items.map((item: any) => (
          <div key={item.id} className="p-3 border rounded-md">
            <p className="font-medium">{item.product.name}</p>
            <p>₹{item.product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
