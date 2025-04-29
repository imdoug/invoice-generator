"use client";

import { useForm, FormProvider, useWatch } from "react-hook-form";
import InvoiceForm from "@/app/components/InvoiceForm";
import InvoicePreview from "@/app/components/InvoicePreview";
import DownloadButton from "@/app/components/DownloadButton";
import Navbar from "@/app/components/NavBar";

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceFormValues {
  businessName: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  notes?: string;
  currency: string;
  logo?: string;
  dueDate: string;
  invoiceNumber?: string;
  issueDate?: string;
}

function generateInvoiceNumber() {
  const today = new Date();
  const year = today.getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}-${randomPart}`;
}

export default function NewInvoicePage() {
  const formMethods = useForm<InvoiceFormValues>({
    defaultValues: {
      businessName: "",
      clientName: "",
      clientAddress: "",
      items: [{ description: "", quantity: 1, price: 0 }],
      notes: "",
      currency: "USD",
      logo: undefined,
      dueDate: "",
      invoiceNumber: generateInvoiceNumber(), 
      issueDate: "",
    },
  });

  const formData = useWatch<InvoiceFormValues>({
    control: formMethods.control,
  }) as InvoiceFormValues;

  return (
    <>      
    <Navbar />
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        
        {/* ✅ Provide the form context here */}
        <FormProvider {...formMethods}>
          <form className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <InvoiceForm formMethods={formMethods} /> {/* ✅ Now useFormContext() will work! */}
          </form>
        </FormProvider>

        <div className="bg-white rounded-lg shadow-md p-6">
          {formData ? (
            <>
              <InvoicePreview formData={formData} />
              <div className="mt-6">
                <DownloadButton formData={formData} />
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">
              Fill the form and preview your invoice here.
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
