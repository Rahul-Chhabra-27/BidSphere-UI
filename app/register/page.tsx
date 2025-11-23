"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
  if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
    toast.error("All fields are required");
    return;
  }

  const toastId = toast.loading("Creating account...");

  try {
    const res = await fetch("http://localhost:8080/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        email,
        full_name: fullName
      })
    });

    const data = await res.json();

    if (!res.ok) {
      const errMessage =
        data.username?.[0] ||
        data.email?.[0] ||
        data.password?.[0] ||
        data.full_name?.[0] ||
        data.message ||
        "Registration failed";

      toast.error(errMessage, { id: toastId });
      return;
    }

    toast.success("Account created successfully", { id: toastId });
    router.push("/login");
  } catch {
    toast.error("Server error", { id: toastId });
  }
};

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 space-y-4 border rounded-xl shadow-sm bg-white">
      <h1 className="text-2xl font-bold text-center">Create an Account</h1>

      <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleRegister}>
        Register
      </Button>

      <p className="text-sm text-center">
        Already registered?
        <span className="text-blue-600 cursor-pointer ml-1" onClick={() => router.push("/login")}>
          Login
        </span>
      </p>
    </div>
  );
}
