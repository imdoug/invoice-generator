import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const projectId = params.id;

  const { error } = await supabaseAdmin
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error(error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
