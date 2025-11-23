"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/my-orders/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch(() => toast.error("Failed to fetch orders"));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders placed yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} className="p-4 bg-white border rounded-lg shadow-sm">
            <p className="font-semibold">Order ID: {order.order_id}</p>
            <p className="text-sm text-gray-600">Status: {order.status}</p>
            <p className="font-bold mt-2">₹{order.total_amount}</p>

            <ul className="list-disc ml-6 text-sm mt-2">
              {order.items.map((it) => (
                <li key={it.product_id}>
                  {it.product_name} × {it.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
