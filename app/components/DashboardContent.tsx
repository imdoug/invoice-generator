"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import DownloadButton from "./DownloadButton";
import ExportCSVButton from "./ExportCsvButton";
import SendInvoiceButton from "./SendInvoiceButton";

export default function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();
  interface Invoice {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any;
    client_email: string;
    client_address: string;
    payment_methods: string;
    id: string;
    invoice_number: string;
    client_name: string;
    issue_date: string | null;
    total: number | null;
    currency: string | null;
  }
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [user, setUser] = useState<{
    business_name: string | null;
    logo_url: string | null;
    address: string | null;
    phone_number: string | null;
  } | null>(null);


  useEffect(() => {
    const fetchInvoices = async () => {
      if (!session?.user?.email) return;

      // 1. Find the user_id based on email
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id,is_pro, business_name,logo_url,address,phone_number")
        .eq("email", session.user.email)
        .single();

      if (userError || !user) {
        console.error("Error finding user:", userError?.message);
        toast.error("User not found. Please log in again.");
        router.push("/login");
        return;
      }

      setIsPro(user.is_pro === true);
      const userId = user.id;
      setUser({
        business_name: user.business_name,
        logo_url: user.logo_url,
        address: user.address,
        phone_number: user.phone_number,
      });

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
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 text-center text-gray-600">
      <svg
        className="animate-spin h-8 w-8 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <p className="text-sm">Loading invoices...</p>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
      {isPro && (
        <div className="inline-block mb-4 px-4 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full shadow-sm">
          ✅ Pro Account
        </div>
      )}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-primary">Your Invoices</h1>

          {isPro && ( <ExportCSVButton /> )}
        </div>
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

                  {/*  Edit  */}
                  <button
                    onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit Invoice
                  </button>
                  {/*  Delete  */}
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
                        setInvoices((prev) => prev.filter((inv) => inv.id !== invoice.id));
                      }
                    }}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  {/*  Download  */}
                  {user  && (
                    <>
                    <DownloadButton
                      profileData={{
                        business_name: user.business_name || "",
                        logo_url: user.logo_url || "",
                        address: user.address || "",
                        phone_number: user.phone_number || "",
                      }}
                      formData={invoice}
                    />
                    <SendInvoiceButton 
                      formData={{
                        clientName: invoice.client_name,
                        clientEmail: invoice.client_email, // Add logic to fetch or set client email
                        clientAddress: invoice.client_address, // Add logic to fetch or set client address
                        paymentMethods: invoice.payment_methods, 
                        items: [...invoice.items], // Add logic to fetch or set items
                        invoiceNumber: invoice.invoice_number,
                        issueDate: invoice.issue_date ?? undefined,
                        total: invoice.total ?? undefined,
                        currency: invoice.currency || "USD",
                      }}
                      profileData={{
                        business_name: user.business_name || "",
                        logo_url: user.logo_url || "",
                        address: user.address || "",
                        phone_number: user.phone_number || "",
                      }} 
                    />
                    </>

                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
