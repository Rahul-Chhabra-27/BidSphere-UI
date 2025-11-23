"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, PlusCircle, Flame, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/context/cartContext";

export default function Navbar() {
  const router = useRouter();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    router.push("/");
  };

  const navItems = [
    { label: "Trending Deals", href: "/trending" },
    { label: "Categories", href: "/" },
    { label: "Surprise Box", href: "/surprise" },
    { label: "About Us", href: "/about" },
    { label: "Sell on BidSphere", href: "/sell" },
  ];

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 gap-4">
        
        <Link href="/" className="text-xl font-bold text-blue-600">
          BidSphere
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm hover:text-blue-600 transition flex items-center gap-2"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">

          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {isLoggedIn && (
            <Button variant="outline" onClick={() => router.push("/orders")}>
              My Orders
            </Button>
          )}

          {!isLoggedIn ? (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-red-600 border-red-400 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <Menu className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile Menu */}
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

          {/* Mobile Cart */}
          <Link href="/cart" className="block text-sm">Cart ({count})</Link>

          {isLoggedIn && (
            <Link href="/orders" className="block text-sm">My Orders</Link>
          )}

          {!isLoggedIn ? (
            <Button className="w-full bg-blue-600" onClick={() => router.push("/login")}>
              Login
            </Button>
          ) : (
            <Button className="w-full text-red-600" variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
