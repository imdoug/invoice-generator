import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { supabase } from "@/lib/supabaseClient";
import DashboardContent from "@/app/components/DashboardContent";
import { notFound, redirect } from "next/navigation";
import Navbar from "../components/NavBar";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) redirect("/login");
  

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


  return (
    <>
      <Navbar/>
      <DashboardContent />
    </>
  );
}

