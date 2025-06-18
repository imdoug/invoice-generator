import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const projectId = params.id;
  const body = await req.json();
  const { name, description, client_id } = body;

  if (!name) {
    return NextResponse.json({ success: false, error: "Name required." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("projects")
    .update({ name, description, client_id })
    .eq("id", projectId);

  if (error) {
    console.error(error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
