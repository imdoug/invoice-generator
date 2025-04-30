"use client";

import { useForm, FormProvider, useWatch } from "react-hook-form";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import DownloadButton from "./DownloadButton";

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

function generateInvoiceNumber() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}${day}-${random}`;
}

export default function NewInvoiceClient() {
  const todayStr = new Date().toISOString().split("T")[0];

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
      invoiceNumber: generateInvoiceNumber(),
      logo: undefined,
    },
  });

  const formData = useWatch<InvoiceFormValues>({
    control: formMethods.control,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <FormProvider {...formMethods}>
        <form className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <InvoiceForm formMethods={formMethods} />
        </form>
      </FormProvider>

      <div className="bg-white rounded-lg shadow-md p-6">
        <InvoicePreview formData={formData as InvoiceFormValues} />
        <div className="mt-6">
          <DownloadButton formData={formData} />
        </div>
      </div>
    </div>
  );
}
