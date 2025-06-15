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

    // Now download PDF
    const doc = (
      <InvoicePDF
        businessName={profileData.business_name}
        logo={profileData.logo_url}
        clientName={formData.client_name}
        clientAddress={formData.client_address}
        clientEmail={formData.client_email}
        dueDate={formData.due_date}
        items={formData.items}
        notes={formData.notes}
        paymentMethods={formData.payment_methods}
        currency={formData.currency}
        invoiceNumber={formData.invoice_number}
        issueDate={formData.issueDate} 
        address={""} 
        phone={""}      />
    );

    const generatedPdf = pdf();
    generatedPdf.updateContainer(doc);
    const blob = await generatedPdf.toBlob();

    const today = new Date();
    const safeClientName = formData?.clientName ? formData.clientName.replace(/\s+/g, "_") : "Client";
    const filename = `Invoice-${safeClientName}-${today.toISOString().split("T")[0]}.pdf`;

    saveAs(blob, filename);
    toast.success("Invoice downloaded successfully!");
  };

  return (
    <button
      onClick={handleDownload}
      type="button"
      className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow transition"
    >
      Download
    </button>
  );
}
