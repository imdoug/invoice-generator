"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

interface DashboardContentProps {
  invoices: any[];
}

export default function DashboardContent({ invoices }: DashboardContentProps) {
  const router = useRouter();

  const handleDelete = async (invoiceId: string) => {
    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoiceId);

    if (error) {
      console.error("Error deleting invoice:", error.message);
      toast.error("Failed to delete invoice.");
      return;
    }

    toast.success("Invoice deleted successfully!");
    router.refresh(); // Refresh the page to reload invoices
  };

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
                    onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit 
                  </button>

                  <button
                    onClick={() => handleDelete(invoice.id)}
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
