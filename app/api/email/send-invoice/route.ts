// app/api/email/send-invoice/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  const { email, invoiceNumber, htmlBody, attachment } = body;

  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: `Invoice ${invoiceNumber}`,
      html: htmlBody,
      attachments: [
        {
          filename: `Invoice-${invoiceNumber}.pdf`,
          content: attachment, // Base64-encoded PDF
        },
      ],
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
