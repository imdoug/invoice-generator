"use client";

import { saveAs } from "file-saver"; // New helper
import { toast } from "react-hot-toast";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF"; // your custom PDF document

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface DownloadButtonProps {
  formData: {
    businessName: string;
    clientName: string;
    clientAddress: string;
    dueDate: string;
    items: InvoiceItem[];
    notes?: string;
    currency: string;
    logo?: string;
    invoiceNumber?: string;
    issueDate?: string
  };
}

export default function DownloadButton({ formData }: DownloadButtonProps) {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  const safeClientName = formData?.clientName ? formData.clientName.replace(/\s+/g, "_") : "Client";
  const filename = `Invoice-${safeClientName}-${dateStr}.pdf`;

  const handleDownload = async () => {
    const doc = (
      <InvoicePDF
        businessName={formData.businessName}
        clientName={formData.clientName}
        clientAddress={formData.clientAddress}
        dueDate={formData.dueDate}
        items={formData.items}
        notes={formData.notes}
        currency={formData.currency}
        logo={formData.logo}
        invoiceNumber={formData.invoiceNumber || "N/A"} // 👈 pulled from form
        issueDate={formData.issueDate || "N/A"} // 👈 pulled from form
      />
    );

    const asPdf = pdf([]); // 👈 creates PDF document
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();

    saveAs(blob, filename);

    toast.success("Invoice downloaded successfully!");
  };

  return (
    <button
      onClick={handleDownload}
      type="button"
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow transition"
    >
      Download Invoice PDF
    </button>
  );
}
