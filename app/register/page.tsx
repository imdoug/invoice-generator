"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // Use your Supabase client
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Insert new user into Supabase
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, name: email.split("@")[0] }])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error.message);
      alert("Error creating user: " + error.message);
      return;
    }

    console.log("User created:", data);

    // 2. After insert, sign in automatically
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error("Sign in failed after registration:", result.error);
      alert("Sign in failed after registration.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleRegister} className="w-full max-w-sm bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-primary">Register</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
