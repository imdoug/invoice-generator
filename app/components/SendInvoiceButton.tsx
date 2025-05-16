"use client";

import { toast } from "react-hot-toast";
import { pdf } from "@react-pdf/renderer";
import { useState } from "react";
import InvoicePDF from "./InvoicePDF"; // adjust path
import { ResendInvoiceData } from "../types/types"; // adjust path based on actual location

interface SendInvoiceButtonProps {
  formData: ResendInvoiceData;
  profileData: {
    business_name: string;
    logo_url: string;
    address: string;
    phone_number: string;
  };
}

export default function SendInvoiceButton({ formData, profileData }: SendInvoiceButtonProps) {
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);

    try {
      const doc = (
        <InvoicePDF
          {...formData}
          businessName={profileData.business_name}
          logo={profileData.logo_url}
          address={profileData.address}
          phone={profileData.phone_number}
        />
      );

      const generatedPdf = pdf();
      generatedPdf.updateContainer(doc);
      const blob = await generatedPdf.toBlob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1]; // remove data:... prefix
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      const res = await fetch("/api/email/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.clientEmail,
          invoiceNumber: formData.invoiceNumber || "Invoice",
          htmlBody: `
            <p>Hi ${formData.clientName},</p>
            <p>Please find attached your invoice <strong>${formData.invoiceNumber}</strong>.</p>
            <p>Thank you!</p>`,
          attachment: base64,
        }),
      });

      const result = await res.json();
      if (result.success) {
        console.log("Email sent successfully:", result);
        toast.success("Invoice sent!");
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown) {
      console.error("Email send failed:", error);
      toast.error("Failed to send invoice.");
    } finally {
      setSending(false);
    }

  };

  return (
    <button
      onClick={handleSend}
      disabled={sending}
      className="text-sm text-indigo-600 hover:underline disabled:opacity-50"
    >
      {sending ? "Sending..." : "Send Invoice"}
    </button>
  );
}
