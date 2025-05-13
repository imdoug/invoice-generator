"use client";

import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import InvoicePDF from "./InvoicePDF";

interface DownloadButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  profileData: { business_name: string; logo_url: string; address: string; phone_number: string };

}

export default function DownloadButton({ formData, profileData }: DownloadButtonProps) {
  const { data: session } = useSession();

  const handleDownload = async () => {
    if (!session?.user?.email) {
      toast.error("User email not found. Please log in again.");
      return;
    }

    // Look up the user in Supabase based on email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (userError || !userData) {
      console.error("Error finding user in Supabase:", userError?.message);
      toast.error("Could not find user in database.");
      return;
    }
    function generateInvoiceNumber() {
      const today = new Date();
      const year = today.getFullYear();
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      return `INV-${year}-${randomPart}`;
    }
    const generatedInvoiceNumber = formData.invoiceNumber || generateInvoiceNumber();


    const userId = userData.id; // ✅ real user id from users table

    // Now save the invoice
    console.log(formData)
    const { error } = await supabase.from("invoices").insert([
      {
        user_id: userId,
        invoice_number: generatedInvoiceNumber,
        issue_date: formData.issueDate || new Date().toISOString(),
        due_date: formData.dueDate || null,
        logo_url: profileData.logo_url,
        business_name: profileData.business_name,
        client_name: formData.clientName,
        client_address: formData.clientAddress,
        client_email: formData.clientEmail, 
        payment_methods: formData.paymentMethods,
        items: formData.items,
        currency: formData.currency,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        total: formData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
        notes: formData.notes || "",
      }
    ]);

    if (error) {
      console.error("Error saving invoice:", error.message);
      toast.error("Failed to save invoice!");
      return;
    }

    toast.success("Invoice saved!");

    // Now download PDF
    const doc = (
      <InvoicePDF
        businessName={profileData.business_name}
        logo={profileData.logo_url}
        clientName={formData.clientName}
        clientAddress={formData.clientAddress}
        clientEmail={formData.clientEmail}
        dueDate={formData.dueDate}
        items={formData.items}
        notes={formData.notes}
        paymentMethods={formData.paymentMethods}
        currency={formData.currency}
        invoiceNumber={formData.invoiceNumber}
        issueDate={formData.issueDate}
      />
    );

    const generatedPdf = pdf();
    generatedPdf.updateContainer(doc);
    const blob = await generatedPdf.toBlob();

    const today = new Date();
    const safeClientName = formData?.clientName ? formData.clientName.replace(/\s+/g, "_") : "Client";
    const filename = `Invoice-${safeClientName}-${today.toISOString().split("T")[0]}.pdf`;

    saveAs(blob, filename);
  };

  return (
    <button
      onClick={handleDownload}
      type="button"
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow transition"
    >
      Save and Download Invoice
    </button>
  );
}
