"use client";

import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

export default function ExportCSVButton() {
  const { data: session } = useSession();

  const handleExport = async () => {
    if (!session?.user?.email) return;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (userError || !user) {
      toast.error("User not found");
      return;
    }

    const { data: invoices, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id);

    if (invoiceError || !invoices) {
      toast.error("Failed to fetch invoices");
      return;
    }

    const csvHeader = [
      "invoice_number,client_name,client_email,issue_date,due_date,total,currency,payment_method"
    ];
    const csvRows = invoices.map(inv =>
      [
        inv.invoice_number,
        inv.client_name,
        inv.client_email,
        inv.issue_date,
        inv.due_date,
        inv.total,
        inv.currency,
        inv.payment_methods
      ].join(",")
    );

    const csvContent = [...csvHeader, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoices-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!session?.user || !("is_pro" in session.user) || !session.user.is_pro) return null;

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow transition"
    >
      Export Invoices (CSV)
    </button>
  );
}
