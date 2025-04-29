"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Navbar from "../components/NavBar";

export default function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!session?.user?.email) return;

      // 1. Find the user_id based on email
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();

      if (userError || !userData) {
        console.error("Error finding user:", userError?.message);
        toast.error("User not found. Please log in again.");
        router.push("/login");
        return;
      }

      const userId = userData.id;

      // 2. Fetch all invoices belonging to this user
      const { data: invoicesData, error: invoicesError } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (invoicesError) {
        console.error("Error fetching invoices:", invoicesError.message);
        toast.error("Error loading invoices.");
      } else {
        setInvoices(invoicesData || []);
      }

      setLoading(false);
    };

    fetchInvoices();
  }, [session, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary">Your Invoices</h1>
        {invoices.length === 0 ? (
          <p className="text-gray-600">No invoices found. Create your first invoice!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white shadow rounded-lg p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {invoice.invoice_number}
                  </h2>

                  <p className="text-gray-600">
                    <span className="font-semibold">Client:</span> {invoice.client_name}
                  </p>

                  <p className="text-gray-600">
                    <span className="font-semibold">Issue Date:</span> {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : "N/A"}
                  </p>

                  <p className="text-gray-600">
                    <span className="font-semibold">Total:</span> {invoice.currency || "USD"} {invoice.total?.toFixed(2) || "0.00"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <button
                    onClick={() => router.push(`/invoices/${invoice.id}`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Details
                  </button>

                  <button
                    onClick={async () => {
                      const { error } = await supabase
                        .from("invoices")
                        .delete()
                        .eq("id", invoice.id);

                      if (error) {
                        toast.error("Failed to delete invoice.");
                      } else {
                        toast.success("Invoice deleted successfully!");
                        router.refresh(); // Re-fetch invoices
                      }
                    }}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
