"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  phone_number: string;
  company_name: string;
}

export default function ClientsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      if (!session?.user?.id) return; // ✅ use session.user.id directly

      const { data: clientData, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error fetching clients");
      } else {
        setClients(clientData || []);
      }

      setLoading(false);
    };

    fetchClients();
  }, [session?.user?.id, router]);

  // Create handler: uses session.user.id too!
  const handleCreate = async () => {
    if (!session?.user?.id) return;

    const name = prompt("Enter client name:");
    if (!name) return;

    const res = await fetch("/api/clients/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, user_id: session.user.id }),
    });

    const result = await res.json();

    if (result.success) {
      toast.success("Client added!");
      router.refresh(); // refresh list
    } else {
      toast.error(result.error || "Failed to add client.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold text-primary mb-6">Your Clients</h1>

        <button
          onClick={handleCreate}
          className="inline-block bg-primary cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md mb-6"
        >
          + Add New Client
        </button>
      </div>
      {loading ? (
        <p>Loading clients...</p>
      ) : clients.length === 0 ? (
        <p className="text-gray-600">No clients found. Add your first client!</p>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex justify-between border-b pb-2 last:border-b-0"
            >
              <div>
                <h3 className="text-lg font-semibold text-primary">{client.name}</h3>
                <p className="text-sm text-gray-600">{client.email}</p>
                <p className="text-sm text-gray-500">{client.company_name}</p>
              </div>
              <div className="flex space-x-4 text-sm flex-col gap-2 ">
                <Link
                  href={`/clients/${client.id}/edit`}
                  className="bg-blue-600 py-2 px-4 text-white rounded-lg text-center w-full"
                >
                  Edit
                </Link>
                <button
                  onClick={async () => {
                    const res = await fetch(`/api/clients/${client.id}/delete`, {
                      method: "DELETE",
                    });
                    if (res.ok) {
                      toast.success("Client deleted");
                      setClients((prev) =>
                        prev.filter((c) => c.id !== client.id)
                      );
                    } else {
                      toast.error("Failed to delete client");
                    }
                  }}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
