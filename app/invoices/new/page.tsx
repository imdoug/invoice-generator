import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Navbar from "@/app/components/NavBar";
import NewInvoiceClient from "@/app/components/NewInvoiceClient"; // 👈 new client component
import { redirect } from "next/navigation";

export default async function NewInvoicePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
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
