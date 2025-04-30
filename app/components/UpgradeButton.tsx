"use client";
import { useSession } from "next-auth/react";

export default function UpgradeButton() {
  const { data: session } = useSession();

  const handleUpgrade = async () => {
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ email: session?.user?.email }),
    });

    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
    >
      Upgrade to Pro
    </button>
  );
}