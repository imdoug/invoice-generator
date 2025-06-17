"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function NewClientPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone_number: "",
    company_name: "",
  });
    if (!session || !session.user?.email) redirect("/login");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("Not authenticated.");
      return;
    }

    const payload = {
      ...form,
      user_id: session.user.id, // ✅ use session user id directly!
    };

    const res = await fetch("/api/clients/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.success) {
      toast.success("Client created!");
      router.push("/clients");
    } else {
      toast.error(result.error || "Failed to create client.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-primary">Add New Client</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {[
          { label: "Name", field: "name" },
          { label: "Email", field: "email" },
          { label: "Address", field: "address" },
          { label: "Phone Number", field: "phone_number" },
          { label: "Company Name", field: "company_name" },
        ].map((input) => (
          <div key={input.field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {input.label}
            </label>
            <input
              type="text"
              value={form[input.field as keyof typeof form]}
              onChange={(e) => handleChange(input.field, e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary"
              required={input.field === "name"}
            />
          </div>
        ))}

        <div className="flex items-center justify-between">
          <Link
            href="/clients"
            className="text-gray-600 hover:text-primary text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-primary hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            Save Client
          </button>
        </div>
      </form>
    </div>
  );
}
