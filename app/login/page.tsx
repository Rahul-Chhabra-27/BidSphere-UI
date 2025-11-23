"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const id = toast.loading("Logging in");
    const res = await fetch("http://localhost:8080/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Login failed", { id });
      return;
    }

    localStorage.setItem("token", data.access);
    localStorage.setItem("userId", String(data.user_id));
    localStorage.setItem("username", data.username);
    toast.success("Login successful", { id });
    router.push("/");
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 space-y-4 border rounded-xl shadow-sm bg-white">
      <h1 className="text-2xl font-bold text-center">Login</h1>

      <Input placeholder="Username" value={username}
        onChange={(e) => setUsername(e.target.value)} />

      <Input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} />

      <Button className="w-full bg-blue-600" onClick={handleLogin}>
        Login
      </Button>

      <p className="text-sm text-center">
        Don't have an account?
        <span onClick={() => router.push("/register")}
          className="text-blue-600 cursor-pointer ml-1">
          Register
        </span>
      </p>
    </div>
  );
}
