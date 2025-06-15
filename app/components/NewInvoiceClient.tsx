"use client";

import { useForm, FormProvider, useWatch } from "react-hook-form";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import { useSession } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    user: {
      logo_url: any;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      invoiceCount?: number;
    };
  }
}
import { useEffect, useState as useReactState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceFormValues {
  businessName: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  paymentMethods: string;
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
  const router = useRouter();
  const { data: session } = useSession();
  const invoiceCount = session?.user?.invoiceCount;
  const [profile, setProfile] = useState({
    business_name: "",
    logo_url: "",
    address: "",
    phone_number: "",
    id: "",
    isPro: false
  });
  const [showPreview, setShowPreview] = useReactState(false);


  const formMethods = useForm<InvoiceFormValues>({
    defaultValues: {
      businessName: "",
      clientName: "",
      clientAddress: "",
      clientEmail: "",
      items: [{ description: "", quantity: 1, price: 0 }],
      notes: "",
      currency: "USD",
      dueDate: "",
      issueDate: "",
      invoiceNumber: generateInvoiceNumber(),
      logo: undefined,
      paymentMethods: "",
    },
  });

  const formData = useWatch<InvoiceFormValues>({
    control: formMethods.control,
  });
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) return;

      const { data, error } = await supabase
        .from("users")
        .select("business_name, is_pro, logo_url, address, phone_number, id")
        .eq("email", session.user.email)
        .single();

      if (data) {
        setProfile({
          business_name: data.business_name,
          logo_url: data.logo_url,
          address: data.address,
          phone_number: data.phone_number,
          id: data.id,
          isPro: data.is_pro,
        });
      }
      if (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [session]);

  const generatedInvoiceNumber =
    formData.invoiceNumber || generateInvoiceNumber();
  const handleSaveInvoice = async () => {
    const { error } = await supabase.from("invoices").insert([
      {
        user_id: profile.id,
        invoice_number: generatedInvoiceNumber,
        due_date: formData.dueDate || null,
        logo_url: profile.logo_url,
        business_name: profile.business_name,
        client_name: formData.clientName,
        client_address: formData.clientAddress,
        client_email: formData.clientEmail,
        payment_methods: formData.paymentMethods,
        items: formData.items,
        currency: formData.currency,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        total: (formData.items || []).reduce(
          (sum: number, item: unknown) => {
            const invoiceItem = item as InvoiceItem;
            return sum + invoiceItem.price * invoiceItem.quantity;
          },
          0
        ),
        notes: formData.notes || "",
      },
    ]);

    if (error) {
      console.error("Error saving invoice:", error.message);
      toast.error("Failed to save invoice!");
      return;
    }
    toast.success("Invoice saved!");
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

return (
  <div className="max-w-4xl mx-auto p-6">
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded"
      >
        {showPreview ? "Back to Form" : "Preview Invoice"}
      </button>

      {invoiceCount && invoiceCount >= 3 && !profile.isPro ? (
        <button
          onClick={() => router.push("/upgrade")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow transition"
        >
          Upgrade to Add More
        </button>
      ) : (
        <button
          onClick={handleSaveInvoice}
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition"
        >
          Save Invoice
        </button>
      )}
    </div>

    {showPreview ? (
      <div className="bg-white rounded-lg shadow-md p-6">
        <InvoicePreview
          formData={formData as InvoiceFormValues}
          profileData={profile}
        />
      </div>
    ) : (
      <FormProvider {...formMethods}>
        <form className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <InvoiceForm />
        </form>
      </FormProvider>
    )}
  </div>
);

}
// Removed the conflicting local useEffect function
function useState(initialState: {
  id: unknown;
  business_name: string;
  logo_url: string;
  address: string;
  phone_number: string;
  isPro: boolean;
}): [
  typeof initialState,
  React.Dispatch<React.SetStateAction<typeof initialState>>
] {
  return useReactState(initialState);
}
