import React from "react";

export default function PaymentSuccessPage() {
  return (
    <div className="text-center mt-16">
      <h1 className="text-3xl font-bold text-green-600">🎉 Payment Successful!</h1>
      <p className="mt-3 text-gray-600">Your order is confirmed.</p>
      <a href="/orders" className="text-blue-600 underline mt-6 inline-block">
        View My Orders 
      </a>
    </div>
  );
}
