"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 bg-white min-h-screen">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-10">
        <h1 className="text-5xl font-extrabold text-blue-600 tracking-tight">
          About BidSphere
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Reimagining the way you buy and sell locally. Secure, fast, and transparent.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At BidSphere, we aim to bridge the gap between buyers and sellers by providing a trustworthy platform for commerce.
            Whether you are looking to declutter your home or find a rare vintage treasure, BidSphere gives you the tools to do it safely.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We believe in sustainability through re-commerce—giving pre-loved items a second life instead of ending up in a landfill.
          </p>
        </div>

        {/* Image Section */}
        <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-xl group bg-gray-200">
          {/* This points to public/about.jpg */}
          <img
            src="/about.jpg"
            alt="Auction Gavel"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback if user forgot to upload the image
              e.currentTarget.src = "https://placehold.co/600x400?text=About+Us+Image";
            }}
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-50 p-10 rounded-2xl text-center space-y-6 mt-8">
        <h2 className="text-3xl font-bold text-gray-900">Ready to get started?</h2>
        <p className="text-gray-600">
          Join thousands of others in the BidSphere community today.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            onClick={() => router.push("/sell")}
          >
            Start Selling
          </Button>
          <Button
            variant="outline"
            className="px-8 py-6 text-lg bg-white hover:bg-gray-100"
            onClick={() => router.push("/categories")}
          >
            Browse Items
          </Button>
        </div>
      </div>
    </div>
  );
}