import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, description, client_id, user_id } = body;

  if (!name || !user_id) {
    return NextResponse.json(
      { success: false, error: "Missing name or user_id." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("projects")
    .insert([{ name, description, client_id, user_id }]);

  if (error) {
    console.error(error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}