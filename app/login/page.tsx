"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ New error state
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    const result = await signIn("credentials",{
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error("Login failed:", result.error);
      setError("Invalid credentials. We couldn't find your account.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-primary">Login</h2>

        {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md text-center text-sm space-y-1">
              <p className="font-semibold">Invalid credentials.</p>
              <p>We couldn&apos;t find your account.</p>
            </div>
        )}
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
          className="w-full bg-primary hover:bg-blue-500 bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
