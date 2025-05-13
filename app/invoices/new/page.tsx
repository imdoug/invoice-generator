import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Navbar from "@/app/components/NavBar";
import NewInvoiceClient from "@/app/components/NewInvoiceClient"; // 👈 new client component
import Link from "next/link";

export default async function NewInvoicePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center">
        <p className="text-gray-600 text-lg">Not authenticated. Please log in to create an invoice.</p>
        <Link href="/login">
          <button className="bg-primary hover:bg-blue-500 bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 p-8">
      <NewInvoiceClient /> {/* ✅ moves client logic here */}
    </div>
    </>
  );
}
