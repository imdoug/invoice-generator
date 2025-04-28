"use client";

import { useForm } from "react-hook-form";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";
import DownloadButton from "./components/DownloadButton";



interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}



interface InvoiceFormValues {
  businessName: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  notes?: string;
  currency: string;
  logo?: string;
  dueDate?: string;
  invoiceNumber?: string;
  issueDate?: string
}

export default function Page() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const generatedInvoiceNumber = `INV-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}-${randomNumber}`;

  const formMethods = useForm<InvoiceFormValues>({
    defaultValues: {
      businessName: "",
      clientName: "",
      clientAddress: "",
      items: [{ description: "", quantity: 1, price: 0 }],
      notes: "",
      currency: "USD",
      logo: undefined,
      dueDate: todayStr,
      invoiceNumber: generatedInvoiceNumber, // 👈 set here
      issueDate: todayStr, // 👈 set here
    },
  });

  const formData = formMethods.watch(); // Live watch!

  return (
    <main className="min-h-screen bg-secondary p-6 flex flex-col md:flex-row gap-8">
      <section className="md:w-1/2">
        <InvoiceForm formMethods={formMethods} />
      </section>

      <section className="md:w-1/2 flex flex-col gap-6">
        <InvoicePreview formData={formData} />
        <DownloadButton formData={formData} />
      </section>
    </main>
  );
}