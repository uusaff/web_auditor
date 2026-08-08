import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuth } from "firebase-admin/auth";
import { adminDb } from "@/lib/firebase-admin"; // Ensure firebase-admin is initialized

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (e) {
        return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 });
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required. Please log in." }, { status: 401 });
    }

    const { plan, isAnnual } = await req.json();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe is not configured on this server." }, { status: 500 });
    }

    let amount = 0;
    let credits = 0;
    let tierId = 'free';

    // Pricing mapping
    if (plan === "Business") {
      amount = isAnnual ? 239 : 299;
      credits = 100;
      tierId = 'pro';
    } else if (plan === "Enterprise") {
      amount = isAnnual ? 799 : 999;
      credits = 500;
      tierId = 'enterprise';
    } else {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    // Multiply by 12 for annual, and by 100 for cents
    const finalAmountInCents = isAnnual ? (amount * 12 * 100) : (amount * 100);

    // Get origin for success/cancel URLs
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `AI Web Auditor - ${plan} Plan ${isAnnual ? '(Annual)' : '(Monthly)'}`,
              description: `Includes ${credits} audit credits`,
            },
            unit_amount: finalAmountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Using one-time payments for simplicity in this integration
      success_url: `${origin}/pricing?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        tierId: tierId,
        credits: credits.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
