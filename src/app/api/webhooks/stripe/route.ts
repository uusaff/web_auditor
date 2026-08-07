import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import * as admin from 'firebase-admin';
import { adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig) throw new Error("Missing stripe-signature header");
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Retrieve metadata we passed during checkout creation
    const userId = session.metadata?.userId;
    const tierId = session.metadata?.tierId;
    const addedCreditsStr = session.metadata?.credits;

    if (userId && tierId && addedCreditsStr && adminDb) {
      try {
        const addedCredits = parseInt(addedCreditsStr, 10);
        const userRef = adminDb.collection("users").doc(userId);
        
        await userRef.update({
          userTier: tierId,
          credits: admin.firestore.FieldValue.increment(addedCredits)
        });
        
        console.log(`[Stripe Webhook] Successfully upgraded user ${userId} to ${tierId} with ${addedCredits} credits.`);
      } catch (dbError) {
        console.error("[Stripe Webhook] Error updating Firebase:", dbError);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }
    } else {
      console.warn("[Stripe Webhook] Missing metadata or adminDb in session:", session.id);
    }
  }

  return NextResponse.json({ received: true });
}
