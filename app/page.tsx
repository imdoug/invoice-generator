"use client";

import { useForm } from "react-hook-form";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";
import DownloadButton from "./components/DownloadButton";
import { SessionProvider } from "next-auth/react"



interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}


interface InvoiceFormValues {
  businessName: string;
  clientName: string;
  clientAddress: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  currency: string;
  logo?: string;
  invoiceNumber?: string;
  issueDate?: string;
}

export default function Page({ session, ...pageProps }) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const generatedInvoiceNumber = `INV-${today.getFullYear()}${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}-${randomNumber}`;
  
  const formMethods = useForm<InvoiceFormValues>({
    defaultValues: {
      businessName: "",
      clientName: "",
      clientAddress: "",
      items: [{ description: "", quantity: 1, price: 0 }],
      notes: "",
      currency: "USD",
      dueDate: todayStr,
      issueDate: todayStr,
      invoiceNumber: generatedInvoiceNumber, // ✅ generate once at form load
      logo: undefined,
    },
  });

  const formData = formMethods.watch(); // Live watch!

  return (
    <SessionProvider session={session}>
    {/* <Component {...pageProps} /> */}
    <main className="min-h-screen bg-secondary p-6 flex flex-col md:flex-row gap-8">
      <section className="md:w-1/2">
        <InvoiceForm formMethods={formMethods} />
      </section>

      <section className="md:w-1/2 flex flex-col gap-6">
        <InvoicePreview formData={formData} />
        <DownloadButton formData={formData} />
      </section>
    </main>
    </SessionProvider>
  );
}