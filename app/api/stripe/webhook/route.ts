import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient"; // your supabase client

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

// Stripe needs the raw body to validate the signature
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle subscription creation
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_email;
    
    if (customerEmail) {
      // Find user in Supabase and mark them as Pro
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", customerEmail)
        .single();

      if (user) {
        const { error: updateError } = await supabase
          .from("users")
          .update({ is_pro: true })
          .eq("id", user.id);

        if (updateError) {
          console.error("Error updating user to pro:", updateError.message);
        } else {
          console.log(`User ${customerEmail} upgraded to Pro.`);
        }
      } else {
        console.error("User not found for email:", customerEmail, userError?.message);
      }
    }
  }

  return NextResponse.json({ received: true });
}
