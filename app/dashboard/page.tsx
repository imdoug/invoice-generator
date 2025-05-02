import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabaseClient";
import DashboardContent from "@/app/components/DashboardContent";
import { notFound } from "next/navigation";
import Navbar from "../components/NavBar";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const authenticationPhrases = [
    "Whoops! Looks like you're a stranger here. Mind slipping on your digital slippers (aka logging in)?",
    "Hold on there, buddy! This VIP lounge requires a secret handshake... or, you know, your login details.",
    "Denied! (Just kidding... mostly. Log in, please!)",
    "This app is playing hard to get. Show it some love by logging in.",
    "Psst! The app says it doesn't recognize you. Time for a digital introduction (login).",
    "Intruder alert! Intruder alert! Just kidding, it's probably just you. Log in for clearance.",
    "The gates are sealed! Only those with the sacred credentials (login) may pass!",
    "Hark, traveler! The digital realm demands your identification! Log in, I say!",
    "This app has trust issues. Prove you're you by logging in.",
    "Login time! Let's get you in here.",
    "Tap, tap... is this thing on? Oh, right, you need to log in first!",
    "The fun starts after you log in. Just sayin'.",
    "Unlock the magic! Log in now.",
    "This app thinks you're a ghost. Prove it wrong by logging in.",
    "Warning: May spontaneously combust if accessed without proper login.",
    "The app is currently doing the robot. It will resume normal programming once you log in."
  ];
  
  function getRandomAuthenticationPhrase() {
    const randomIndex = Math.floor(Math.random() * authenticationPhrases.length);
    return authenticationPhrases[randomIndex];
  }

  if (!session || !session.user?.email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center">
        <p className="text-gray-600 text-lg">{getRandomAuthenticationPhrase()}</p>
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

  // 2. Fetch all invoices belonging to this user
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

    // console.log("Invoices:", invoices);
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

