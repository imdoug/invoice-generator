"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Project {
  id: string;
  name: string;
  description: string | null;
  client_id: string | null;
  created_at: string;
}

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error fetching projects");
      } else {
        setProjects(data || []);
      }

      setLoading(false);
    };

    fetchProjects();
  }, [session?.user?.id]);

  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Your Projects</h1>
        <Link
          href="/projects/new"
          className="bg-primary bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
        >
          + New Project
        </Link>
      </header>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects found. Create your first one!</p>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <article key={project.id} className="bg-white shadow rounded-lg p-6">
              <header className="mb-4">
                <h2 className="text-xl font-semibold text-primary">{project.name}</h2>
              </header>
              {project.description && (
                <p className="text-gray-700 mb-4">{project.description}</p>
              )}
              <footer className="flex space-x-4 text-sm border-t pt-4">
                <Link
                  href={`/projects/${project.id}/edit`}
                  className="bg-blue-600  py-2  px-4 rounded-lg text-white cursor-pointer"
                >
                  Edit
                </Link>
                <button
                  onClick={async () => {
                    const res = await fetch(`/api/projects/${project.id}/delete`, {
                      method: "DELETE",
                    });
                    const result = await res.json();
                    if (result.success) {
                      toast.success("Project deleted");
                      setProjects((prev) => prev.filter((p) => p.id !== project.id));
                    } else {
                      toast.error("Failed to delete project");
                    }
                  }}
                  className="p-2 rounded-lg text-white bg-red-500 cursor-pointer"
                >
                  Delete
                </button>
              </footer>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
