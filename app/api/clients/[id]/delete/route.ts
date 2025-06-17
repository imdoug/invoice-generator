// app/api/clients/[id]/delete/route.ts

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const clientId = params.id;

  try {
    // Just delete directly by ID — RLS ensures user can only delete their own client
    const { error } = await supabaseAdmin
      .from("clients")
      .delete()
      .eq("id", clientId);

    if (error) {
      console.error("Delete error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
