import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function HomePage() {
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center space-y-8 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-primary">
        Welcome to Invoice Generator
      </h1>
      <p className="text-gray-700 max-w-2xl">
        Easily create, manage, and download your invoices. Fast, simple, and professional.
      </p>
      <Link href="/invoices/new">
        <button className="bg-primary hover:bg-blue-500 bg-blue-700 text-white font-semibold py-3 px-8 rounded-md text-lg shadow transition">
          Create New Invoice
        </button>
      </Link>
    </main>
  );
}
