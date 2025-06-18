"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Client {
  id: string;
  name: string;
}

export default function EditProjectPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    client_id: "",
  });

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      // ✅ 1) Fetch project details
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError || !project) {
        toast.error("Project not found.");
        router.push("/projects");
        return;
      }

      setForm({
        name: project.name || "",
        description: project.description || "",
        client_id: project.client_id || "",
      });

      // ✅ 2) Fetch available clients to select
      const { data: clientData } = await supabase
        .from("clients")
        .select("id, name")
        .eq("user_id", session?.user?.id);

      if (clientData) {
        setClients(clientData);
      }
    };

    fetchData();
  }, [projectId, session?.user?.id, router]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/projects/${projectId}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();

    if (result.success) {
      toast.success("Project updated!");
      router.push("/projects");
    } else {
      toast.error(result.error || "Failed to update project.");
    }
  };

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-primary">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Related Client (optional)
          </label>
          <select
            value={form.client_id}
            onChange={(e) => handleChange("client_id", e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50"
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <footer className="flex justify-between">
          <Link href="/projects" className="text-gray-600 hover:text-primary text-sm">
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-primary bg-blue-500 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
          >
            Save Changes
          </button>
        </footer>
      </form>
    </main>
  );
}
