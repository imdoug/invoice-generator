"use client";

import { useSession } from "next-auth/react";

export default function UpgradePage() {
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
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center space-y-10">
      <h1 className="text-4xl font-bold text-primary text-center">
        Unlock Pro Features 🚀
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl space-y-6">
        <ul className="space-y-4 text-gray-700 text-lg">
          <li>✅ Unlimited Invoices</li>
          <li>✅ Upload Your Business Logo</li>
          <li>✅ Download High-Quality PDF Invoices</li>
          <li>✅ Priority Support</li>
          <li>✅ Access to New Features First</li>
        </ul>

        <div className="text-center mt-8">
          <button
            onClick={handleUpgrade}
            className="bg-primary hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition"
          >
            Upgrade for $9/month
          </button>

          <p className="text-gray-500 text-sm mt-2">Cancel anytime, no commitment.</p>
        </div>
      </div>
    </main>
  );
}
