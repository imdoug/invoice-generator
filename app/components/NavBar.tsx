"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X } from "lucide-react"; // optional icons if you want better hamburger

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 hover:text-primary focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-700 hover:text-primary font-semibold"
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/invoices/new")}
              className="text-gray-700 hover:text-primary font-semibold"
            >
              New Invoice
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="hidden md:block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="block w-full text-left text-gray-700 hover:text-primary font-semibold"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/invoices/new")}
            className="block w-full text-left text-gray-700 hover:text-primary font-semibold"
          >
            New Invoice
          </button>

          <button
            onClick={handleLogout}
            className="block w-full text-left bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
