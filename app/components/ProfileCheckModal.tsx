"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ProfileCheckModal() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!session?.user?.email) return;

      const alreadyDismissed = localStorage.getItem("profileCheckDismissed");
      if (alreadyDismissed) {
        setChecking(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("name, phone_number, address, business_name, profile_complete")
        .eq("email", session.user.email)
        .single();

      if (!error && data && window.location.pathname !== "/profile") {
        const { name, phone_number, address, business_name, profile_complete } = data;

        const isComplete = name && phone_number && address && business_name;

        if (!isComplete && !profile_complete) {
          setShowModal(true);
          localStorage.setItem("profileCheckDismissed", "true");
        }
      }

      setChecking(false);
    };

    checkProfile();
  }, [session]);

  if (!showModal || checking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold text-primary mb-4">Complete Your Profile</h2>
        <p className="text-gray-700 mb-4">
          Incomplete profile, incomplete vibes. Let’s fix that—name, address, 
          phone, business name. Logo? Optional. Looking good? Required!
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-600 hover:underline text-sm"
          >
            Remind me later
          </button>

          <Link href="/profile">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
              Go to Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
