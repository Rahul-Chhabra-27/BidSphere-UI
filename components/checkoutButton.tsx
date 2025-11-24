"use client";

import Script from "next/script";
import { useCart } from "@/app/context/cartContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CheckoutButton() {
  const { cart, cartCount, totalAmount } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    if (cartCount === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const toastId = toast.loading("Creating order...");
    const res = await fetch("http://localhost:8080/create-order/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        amount: totalAmount,
        cart_items: cart,
      }),
    });

    const data = await res.json();
    toast.dismiss(toastId);

    if (!res.ok) {
      toast.error(data.error || "Failed to create order");
      router.push("/cart");
      return;
    }

    startPayment(data);
  };

  const startPayment = (data: any) => {
    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: "INR",
      name: "BIDSphere",
      order_id: data.order.id,
      handler: async function (response: any) {
        const verify = await fetch("http://localhost:8080/verify-payment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(response),
        });

        if (verify.ok) {
          toast.success("Payment Completed");
          router.push("/orders/success");
        } else {
          toast.error("Payment failed");
          router.push("/cart");
        }
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled");
          router.push("/cart");
        },
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        onClick={handleCheckout}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg mt-3"
      >
        Pay ₹{totalAmount}
      </button>
    </>
  );
}
