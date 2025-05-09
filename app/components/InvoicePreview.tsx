"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { format } from "date-fns";
import { useSession } from "next-auth/react";


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
  items: InvoiceItem[];
  notes?: string;
  currency: string;
  logo?: string;
  dueDate?: string;
  invoiceNumber?: string;
  paymentMethods?: string;

}

interface InvoicePreviewProps {
  formData: InvoiceFormValues;
  profileData: { business_name: string; logo_url: string; address: string; phone_number: string };

}


export default function InvoicePreview({ formData }: InvoicePreviewProps) {
  const { data: session } = useSession();

  const [profile, setProfile] = useState({ business_name: "", logo_url: "", address: "", phone_number: "" });
  const [invoiceNumber, setInvoiceNumber] = useState<string | undefined>(undefined);
  const { clientName, clientAddress, items, notes, currency, clientEmail } = formData;

  useEffect(() => {
    // ✅ Only generate on client after mount
    if (!formData.invoiceNumber) {
      setInvoiceNumber(generateInvoiceNumber());
    } else {
      setInvoiceNumber(formData.invoiceNumber);
    }
  }, [formData.invoiceNumber]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) return;

      const {
        data,
        error,
      } = await supabase
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
  }, [session]);

  const subtotal = items.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.price || 0);
    return sum + itemTotal;
  }, 0);

  const currencyLocaleMap: Record<string, string> = {
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    JPY: "ja-JP",
    BRL: "pt-BR",
  };

  function formatCurrency(value: number, currency: string = "USD") {
    const locale = currencyLocaleMap[currency] || "en-US";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  }

  function generateInvoiceNumber() {
    const today = new Date();
    const year = today.getFullYear();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `INV-${year}-${randomPart}`;
  }

  if (!invoiceNumber) {
    return null; // or small loading spinner
  }

  return (
    <div id="invoice-preview" className="border p-6 rounded bg-white shadow space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        
        {/* Left: Logo + Business Info */}
        <div className="flex space-x-4 items-start">
          {profile.logo_url && (
            <div className="h-20 w-32 relative">
              <Image
                src={profile.logo_url}
                alt="Business Logo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}

          <div className="text-gray-800">
            <h2 className="text-2xl font-bold">{profile.business_name || "Your Business Name"}</h2>
            <p className="text-sm mt-1">{profile.address || "Your Address"}</p>
            <p className="text-sm mt-1">{profile.phone_number || "(934)-883-328"}</p>
          </div>
        </div>

        {/* Right: Invoice Info */}
        <div className="text-sm text-gray-700 text-right space-y-1">
        <p><span className="font-semibold">Invoice #:</span> {invoiceNumber}</p>
        <p><span className="font-semibold">Issue Date:</span> {format(new Date(), "yyyy-MM-dd")}</p>
          {formData.dueDate && (
            <p><span className="font-semibold">Due Date:</span> {formData.dueDate}</p>
          )}
        </div>
      </div>

      {/* Client Info */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2 text-primary">Bill To:</h3>
        <p className="text-gray-800">{clientName || "Client Name"}</p>
        <p className="text-gray-600">{clientAddress || "Client Address"}</p>
        <p className="text-gray-600">{clientEmail || "Client Email"}</p>
      </div>

      {/* Items */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2 text-primary">Invoice Items</h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm border-b pb-1"
            >
              <span>{item.description || "Item description"}</span>
              <span>{item.quantity} × {formatCurrency(item.price || 0, currency)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm mb-1 text-primary">Notes:</h4>
          <p className="text-gray-600 text-sm">{notes}</p>
        </div>
      )}

      {/* Totals */}
      <div className="border-t pt-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-primary">Payment Methods</h3>
          <p className="text-gray-800 p-2">{formData.paymentMethods || "Bank Transfer"}</p>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal, currency)}</span>
        </div>
        <div className="flex justify-between font-bold text-xl mt-2 text-primary">
          <span>Total:</span>
          <span>{formatCurrency(subtotal, currency)}</span>
        </div>
      </div>

    </div>
  );
}


