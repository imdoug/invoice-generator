import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id;
    const body = await req.json();
    const { name, email, address, phone_number, company_name } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("clients")
      .update({
        name,
        email,
        address,
        phone_number,
        company_name,
      })
      .eq("id", clientId);

    if (error) {
      console.error("Update error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
