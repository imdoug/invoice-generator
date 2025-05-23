"use client";

import { useFieldArray, useFormContext } from "react-hook-form";

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceFormValues {
  businessName: string;
  clientName: string;
  clientAddress: string;
  clientEmail?: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  currency: string;
  logo?: string;
  invoiceNumber?: string;
  issueDate?: string;
  paymentMethods?: string;
}

export default function InvoiceForm() {
  const { register, control } = useFormContext<InvoiceFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <div className="space-y-8">
      {/* Client Info Section */}
      <div className="bg-white shadow rounded p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-primary">Client Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name</label>
            <input {...register("clientName")} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Address</label>
            <input {...register("clientAddress")} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Email</label>
            <input {...register("clientEmail")} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary" />
          </div>
          <div className="flex gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input type="date" {...register("dueDate")} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary" />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select {...register("currency")} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary">
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="JPY">¥ JPY</option>
                <option value="BRL">R$ BRL</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items Section */}
      <div className="bg-white shadow rounded p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-primary">Invoice Items</h3>

        <div className="hidden sm:flex gap-4 text-sm text-gray-500 mb-2">
          <div className="flex-1">Description</div>
          <div className="w-20 text-center">Qty</div>
          <div className="w-24 text-center">Price</div>
          <div className="w-20"></div>
        </div>

        {fields.map((item, index) => (
          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 mb-6 border-b pb-4">
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1 sm:hidden">Description</label>
              <input
                {...register(`items.${index}.description`)}
                placeholder="Service / Product"
                className="w-full rounded-md border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:w-20">
                <label className="block text-sm text-gray-600 mb-1 sm:hidden">Qty</label>
                <input
                  type="number"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  placeholder="Qty"
                  className="w-full rounded-md border-gray-300 bg-gray-50 text-center focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="flex-1 sm:w-24">
                <label className="block text-sm text-gray-600 mb-1 sm:hidden">Price</label>
                <input
                  type="number"
                  {...register(`items.${index}.price`, { valueAsNumber: true })}
                  placeholder="Price"
                  className="w-full rounded-md border-gray-300 bg-gray-50 text-center focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="sm:w-auto mt-2 sm:mt-0 text-right">
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ description: "", quantity: 1, price: 0 })}
          className="mt-2 text-blue-600 text-sm hover:underline"
        >
          + Add another item
        </button>
      </div>

      {/* Notes Section */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="bg-white shadow rounded p-6 mb-8 w-full">
          <h3 className="text-lg font-semibold mb-4 text-primary">Additional Notes</h3>
          <textarea {...register("notes")} rows={4} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary" />
        </div>

        <div className="bg-white shadow rounded p-6 mb-8 w-full">
          <h3 className="text-lg font-semibold mb-4 text-primary">Payment Method</h3>
          <textarea {...register("paymentMethods")} rows={4} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary" />
        </div>
      </div>
    </div>
  );
}
