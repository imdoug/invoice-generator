import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // 1. Fetch the invoice from Supabase
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !invoice) {
    console.error("Invoice not found or error fetching:", error?.message);
    return notFound(); // built-in Next.js 404 page
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Invoice #{invoice.invoice_number}
        </h1>

        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Client:</span> {invoice.client_name}</p>
          <p><span className="font-semibold">Address:</span> {invoice.client_address}</p>
          <p><span className="font-semibold">Issue Date:</span> {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : "N/A"}</p>
          <p><span className="font-semibold">Due Date:</span> {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : "N/A"}</p>
          <p><span className="font-semibold">Notes:</span> {invoice.notes || "No notes provided."}</p>
        </div>

        <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Items</h2>

        <div className="space-y-2">
          {invoice.items?.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between border-b py-2">
              <div>{item.description}</div>
              <div>{item.quantity} × {invoice.currency || "USD"} {item.price?.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="text-right text-xl font-bold text-primary mt-6">
          Total: {invoice.currency || "USD"} {invoice.total?.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
