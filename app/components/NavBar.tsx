"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X } from "lucide-react"; // mobile icons
import Link from "next/link";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPro, setIsPro] = useState<boolean | null>(null);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };
  
  useEffect(() => {
    const fetchProStatus = async () => {
      if (!session?.user?.email) return;
  
      const { data, error } = await supabase
        .from("users")
        .select("is_pro")
        .eq("email", session.user.email)
        .single();
  
      if (error) {
        console.error("Error checking Pro status:", error.message);
        setIsPro(false); // fallback to free
      } else {
        setIsPro(data?.is_pro === true);
      }
    };
  
    fetchProStatus();
  }, [session]);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Left Side: Brand + Desktop Links */}
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-2xl font-bold text-primary hover:text-blue-700">
            InvoiceGen
          </Link>

          <div className="hidden md:flex space-x-6">

            <Link href="/invoices/new" className="text-gray-700 hover:text-primary font-semibold">
              New Invoice
            </Link>

            {/* Show Upgrade link only if user is NOT Pro */}
            {isPro === false && (
              <Link href="/upgrade" className="text-blue-600 hover:text-blue-800 font-semibold">
                Upgrade
              </Link>
            )}
          </div>
        </div>

        {/* Right Side: Hamburger + Desktop Logout */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 hover:text-primary focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <button
            onClick={handleLogout}
            className="hidden md:block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-6 space-y-4">

          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 hover:text-primary font-semibold"
          >
            Dashboard
          </Link>

          <Link
            href="/invoices/new"
            onClick={() => setMenuOpen(false)}
            className="block text-gray-700 hover:text-primary font-semibold"
          >
            New Invoice
          </Link>

          {isPro === false  && (
            <Link
              href="/upgrade"
              onClick={() => setMenuOpen(false)}
              className="block text-blue-600 hover:text-blue-800 font-semibold"
            >
              Upgrade
            </Link>
          )}

          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="block w-full text-left bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
