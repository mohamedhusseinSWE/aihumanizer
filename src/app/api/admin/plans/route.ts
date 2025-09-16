import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

import Stripe from "stripe";

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

// GET /api/plans
export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, plans });
  } catch (error) {
    console.error("Failed to fetch plans:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch plans" },
      { status: 500 },
    );
  }
}

// POST /api/plans
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description = "",
      features = "",
      status = "ACTIVE",
      isPopular = false,
      price = 0,
      interval = "monthly",
      wordLimitPerRequest = 0,
      wordsPerMonth = 0,
      models = [],
    } = body;

    // Optional: create Stripe product/price only if price > 0
    let priceId: string | null = null;
    if (price > 0) {
      const product = await stripe.products.create({ name });
      const stripePrice = await stripe.prices.create({
        unit_amount: Math.round(price * 100), // cents
        currency: "usd",
        recurring: { interval: interval === "monthly" ? "month" : "year" },
        product: product.id,
      });
      priceId = stripePrice.id;
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        description,
        features,
        status,
        isPopular,
        price,
        interval,
        wordLimitPerRequest,
        wordsPerMonth,
        priceId,
        models, // array of models
      },
    });

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("❌ Failed to create plan:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create plan" },
      { status: 500 },
    );
  }
}
