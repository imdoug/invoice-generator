"use client";

import { useForm, FormProvider } from "react-hook-form";

type InvoiceFormValues = {
  businessName: string;
  clientName: string;
  clientAddress: string;
  dueDate: string;
  items: Array<{ description: string; quantity: number; price: number }>;
  notes: string;
  currency: string;
  clientEmail: string;
  logo: string;
  invoiceNumber: string;
  paymentMethods: string,
  issueDate: string;
};

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import InvoiceForm from "./InvoiceForm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditInvoiceClient({ invoice }: { invoice: any }) {
  const router = useRouter();

  const formMethods = useForm<InvoiceFormValues>();

  useEffect(() => {
    if (invoice) {
      formMethods.reset({
        businessName: invoice.business_name,
        clientName: invoice.client_name,
        clientEmail: invoice.client_email,
        clientAddress: invoice.client_address,
        dueDate: invoice.due_date,
        items: invoice.items,
        notes: invoice.notes,
        currency: invoice.currency,
        logo: invoice.logo,
        invoiceNumber: invoice.invoice_number,
        paymentMethods: invoice.payment_methods,
        issueDate: invoice.issue_date,
      });
    }
  }, [invoice, formMethods]);

  const onSubmit = async (data: InvoiceFormValues) => {
    const calculatedTotal = data.items.reduce((sum, item) => {
      const itemTotal = (item.quantity || 0) * (item.price || 0);
      return sum + itemTotal;
    }, 0);
  
    const { error } = await supabase
      .from("invoices")
      .update({
        business_name: data.businessName,
        client_name: data.clientName,
        client_address: data.clientAddress,
        client_email: invoice.client_email,
        due_date: data.dueDate,
        items: data.items,
        notes: data.notes,
        currency: data.currency,
        logo: data.logo,
        invoice_number: data.invoiceNumber,
        payment_methods: invoice.payment_methods,
        issue_date: data.issueDate,
        total: calculatedTotal, // ✅ add this line
      })
      .eq("id", invoice.id);
  
    if (error) {
      toast.error("Failed to update invoice");
      console.error(error);
    } else {
      toast.success("Invoice updated!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-primary">Edit Invoice</h1>

      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
          <InvoiceForm />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-500 bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition"
          >
            Save Changes
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
