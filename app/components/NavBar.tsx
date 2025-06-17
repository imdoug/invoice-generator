"use client";

import { useEffect, useState, Fragment } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ProfileCheckModal from "./ProfileCheckModal";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [invoiceCount, setInvoiceCount] = useState<number | null>(null);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("profileCheckDismissed");
    router.push("/login");
  };

  useEffect(() => {
    const fetchInvoiceCount = async () => {
      if (!session?.user?.email) return;

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id,is_pro")
        .eq("email", session.user.email)
        .single();

      if (user && user.id) {
        const { count, error: countError } = await supabase
          .from("invoices")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        setIsPro(user.is_pro === true);
        if (!countError) {
          setInvoiceCount(count);
        }
      }
      if (userError) {
        console.error("Error fetching user ID:", userError.message);
      }
    };

    fetchInvoiceCount();
  }, [session]);

  const NavItem = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href;
    return isActive ? (
      <span className="text-blue-700 font-bold cursor-default">{label}</span>
    ) : (
      <Link href={href} className="text-gray-700 hover:text-primary font-semibold">
        {label}
      </Link>
    );
  };

  const initials = session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "";

  return (
    <>
      <ProfileCheckModal />
      <nav className="bg-white shadow-md relative">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-2xl font-bold text-primary hover:text-blue-700">
              InvoiceGen
            </Link>

            <div className="hidden md:flex space-x-6">
              <NavItem href="/clients" label="Clients" />
              <NavItem href="/projects" label="Projects" />
              {(isPro || (invoiceCount !== null && invoiceCount < 3)) && (
                <NavItem href="/invoices/new" label="New Invoice" />
              )}
              {!isPro && invoiceCount !== null && invoiceCount >= 3 && (
                <button
                  onClick={() => router.push("/upgrade")}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Upgrade to Add More
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 relative">
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-700 hover:text-primary focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* User Menu */}
            {session && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300"
                >
                  {session.user.logo_url ? (
                    <Image src={session.user.logo_url} alt="Profile" width={35} height={35} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-700 font-bold">{initials}</span>
                  )}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold">{session.user.name}</p>
                      <p className="text-xs text-gray-500">{isPro ? "Pro Plan" : "Free Plan"}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {!isPro && (
                      <Link
                        href="/upgrade"
                        className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Upgrade to Pro
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col bg-white px-6 pb-6 space-y-4">
            <NavItem href="/clients" label="Clients" />
            <NavItem href="/projects" label="Projects" />
            {(isPro || (invoiceCount !== null && invoiceCount < 3)) && (
              <NavItem href="/invoices/new" label="New Invoice" />
            )}
            {!isPro && invoiceCount !== null && invoiceCount >= 3 && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/upgrade");
                }}
                className="block text-blue-600 hover:text-blue-800 font-semibold"
              >
                Upgrade to Add More
              </button>
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
    </>
  );
}
