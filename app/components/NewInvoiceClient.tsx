"use client";

import { useForm, FormProvider, useWatch } from "react-hook-form";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import DownloadButton from "./DownloadButton";
import { useSession } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    user: {
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
  const todayStr = new Date().toISOString().split("T")[0];
  const router = useRouter();
  const { data: session } = useSession();
  const invoiceCount = session?.user?.invoiceCount;
  const [profile, setProfile] = useState({
    business_name: "",
    logo_url: "",
    address: "",
    phone_number: "",
  });

  const formMethods = useForm<InvoiceFormValues>({
    defaultValues: {
      businessName: "",
      clientName: "",
      clientAddress: "",
      clientEmail: "",
      items: [{ description: "", quantity: 1, price: 0 }],
      notes: "",
      currency: "USD",
      dueDate: todayStr,
      issueDate: todayStr,
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
        .select("business_name, logo_url, address, phone_number")
        .eq("email", session.user.email)
        .single();

      if (data) setProfile(data);
      console.log("Profile data:", data);
      if (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
    console.log("Profile data:", profile);
  }, [session]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <FormProvider {...formMethods}>
        <form className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <InvoiceForm formMethods={formMethods} profileData={profile} />
        </form>
      </FormProvider>

      <div className="bg-white rounded-lg shadow-md p-6">
        <InvoicePreview
          formData={formData as InvoiceFormValues}
          profileData={profile}
        />
        <div className="mt-6">
          {invoiceCount && invoiceCount >= 3 ? (
            <button
              onClick={() => {
                router.push("/upgrade");
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow transition"
            >
              Upgrade to Add More
            </button>
          ) : (
            <DownloadButton formData={formData} profileData={profile} />
          )}
        </div>
      </div>
    </div>
  );
}
// Removed the conflicting local useEffect function
function useState(initialState: {
  business_name: string;
  logo_url: string;
  address: string;
  phone_number: string;
}): [
  typeof initialState,
  React.Dispatch<React.SetStateAction<typeof initialState>>
] {
  return useReactState(initialState);
}
