import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabaseClient";
import DashboardContent from "@/app/components/DashboardContent";
import { notFound } from "next/navigation";
import Navbar from "../components/NavBar";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center">
        <p className="text-gray-600 text-lg">Not authenticated. Please log in to access the app.</p>
        <Link href="/login">
          <button className="bg-primary hover:bg-blue-500 bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

  // 1. Find the user_id based on email
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (userError || !userData) {
    console.error("Error finding user:", userError?.message);
    return notFound();
  }

  const userId = userData.id;

  console.log("User ID:", userId);

  // 2. Fetch all invoices belonging to this user
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

    console.log("Invoices:", invoices);
  if (invoicesError) {
    console.error("Error fetching invoices:", invoicesError.message);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Error loading invoices.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar/>
      <DashboardContent invoices={invoices || []} />
    </>
  );
}

