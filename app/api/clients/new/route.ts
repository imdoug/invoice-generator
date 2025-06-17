// app/api/clients/new/route.ts

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, address, phone_number, company_name, user_id } = body;

    if (!name || !user_id) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("clients")
      .insert([{ name, email, address, phone_number, company_name, user_id }]);

    if (error) {
      console.error("Insert error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
