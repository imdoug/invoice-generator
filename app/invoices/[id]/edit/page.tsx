import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { supabase } from "@/lib/supabaseClient";
import { notFound, redirect } from "next/navigation";
import EditInvoiceClient from "@/app/components/EditInvoiceClient";



export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  const { id } = await params;
  
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !invoice) {
    return notFound();
  }

  return <EditInvoiceClient invoice={invoice} />;
}
