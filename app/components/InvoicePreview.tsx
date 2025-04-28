"use client";

import Image from "next/image";
import { format } from "date-fns";

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
}

interface InvoicePreviewProps {
  formData: InvoiceFormValues;
}

export default function InvoicePreview({ formData }: InvoicePreviewProps) {
  const { businessName, clientName, clientAddress, items, notes } = formData;

  // Calculate subtotal and total
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

  function generateInvoiceNumber() {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `INV-${randomNumber}`;
  }
  function formatCurrency(value: number, currency: string = "USD") {
    const locale = currencyLocaleMap[currency] || "en-US";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  }

  return (
    <div id="invoice-preview" className="bg-white shadow rounded p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        {/* Logo on the left */}
        {formData.logo && (
          <div className="h-20 w-32 relative">
            <Image
              src={formData.logo}
              alt="Business Logo"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}

        {/* Business Info on the right */}
        <div className="text-right flex-1 ml-4">
          <h2 className="text-2xl font-bold">{ businessName || "Your Business Name"}</h2>
          <p className="text-sm text-gray-600 mt-1">{clientName || "Client Name"}</p>
          <p className="text-sm text-gray-600">{clientAddress || "Client Address"}</p>
        </div>
        <div className="ml-4 text-sm text-gray-700">
  <p><span className="font-semibold">Invoice #:</span> {generateInvoiceNumber()}</p>
  <p><span className="font-semibold">Issue Date:</span> {format(new Date(), "yyyy-MM-dd")}</p>
  {formData.dueDate && (
    <p><span className="font-semibold">Due Date:</span> {formData.dueDate}</p>
  )}
</div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Invoice Items</h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between border-b pb-1 text-sm"
            >
              <span>{item.description || "Item description"}</span>
              <span>
                {item.quantity} ×{" "}
                {formatCurrency(item.price || 0, formData.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="mb-6">
          <h4 className="font-semibold text-sm">Notes:</h4>
          <p className="text-gray-600 text-sm">{notes}</p>
        </div>
      )}

      {/* Totals */}
      <div className="border-t pt-4">
        <div className="flex justify-between font-semibold text-lg">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal, formData.currency)}</span>
        </div>
        <div className="flex justify-between font-bold text-xl mt-2">
          <span>Total:</span>
          <span>{formatCurrency(subtotal, formData.currency)}</span>
        </div>
      </div>
    </div>
  );
}
