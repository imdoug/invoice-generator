// app/invoices/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"; // ✅ moved to clean location
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/app/components/NavBar";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center">
        <p className="text-gray-600 text-lg">
          Not authenticated. Please log in to view invoices.
        </p>
        <Link href="/login">
          <button className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

  const { id } = await params;

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !invoice) {
    console.error("Error fetching invoice:", error?.message);
    return notFound();
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow space-y-6">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Invoice #{invoice.invoice_number}
          </h1>

          <div className="text-gray-700 space-y-2">
            <p>
              <span className="font-semibold">Client Name:</span>{" "}
              {invoice.client_name}
            </p>
            <p>
              <span className="font-semibold">Client Address:</span>{" "}
              {invoice.client_address}
            </p>
            <p>
              <span className="font-semibold">Client Email:</span>{" "}
              {invoice.client_email}
            </p>
            <p>
              <span className="font-semibold">Payment Method:</span>{" "}
              {invoice.payment_method}
            </p>
            <p>
              <span className="font-semibold">Issue Date:</span>{" "}
              {invoice.issue_date
                ? new Date(invoice.issue_date).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <span className="font-semibold">Due Date:</span>{" "}
              {invoice.due_date
                ? new Date(invoice.due_date).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          <div className="border-t pt-4 space-y-2">
            <h2 className="text-2xl font-bold text-primary">Items</h2>
            {invoice.items.map(
              (
                item: { description: string; quantity: number; price: number },
                idx: number
              ) => (
                <div
                  key={idx}
                  className="flex justify-between border-b pb-2 text-sm"
                >
                  <span>{item.description}</span>
                  <span>
                    {item.quantity} × {item.price.toFixed(2)}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="text-right text-xl font-bold text-primary pt-6">
            Total: {invoice.currency || "USD"} {invoice.total?.toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
}
