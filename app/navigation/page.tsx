"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, PlusCircle, Flame } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Trending Deals", href: "/trending", icon: <Flame className="h-4 w-4 text-orange-500" /> },
    { label: "Categories", href: "/" },
    { label: "Surprise Box", href: "/surprise" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 gap-4">


        <Link href="/" className="text-xl font-bold text-blue-600">
          BIDSphere
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm hover:text-blue-600 transition flex items-center gap-2"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right-side CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => router.push("/sell")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Sell Something
          </Button>

          <Button
            variant="outline"
            className="text-red-600 border-red-400 hover:bg-red-50"
            onClick={() => alert("Logging out")}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t shadow-sm px-4 py-3 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block text-sm hover:text-blue-600 transition"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => router.push("/sell")}
          >
            Sell Something
          </Button>

          <Button
            variant="ghost"
            className="w-full text-red-600"
            onClick={() => alert("Logging out")}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
