import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

function generateRandomCoupon(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, couponCount, planId } = body;

    console.log("🎯 Creating campaign:", { name, couponCount, planId });

    // Validate input
    if (!name || !couponCount || !planId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required parameters: name, couponCount, planId",
        },
        { status: 400 },
      );
    }

    // Validate plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan) {
      return NextResponse.json(
        { success: false, message: "Plan not found" },
        { status: 404 },
      );
    }

    // 1️⃣ Create Campaign
    const campaign = await prisma.campaign.create({
      data: { name },
    });

    console.log("✅ Campaign created:", campaign.id);

    // 2️⃣ Generate Coupons
    const couponsData = Array.from({ length: parseInt(couponCount) }).map(
      () => ({
        code: `${name.toUpperCase().replace(/\s+/g, "")}-${generateRandomCoupon(
          6,
        )}`,
        campaignId: campaign.id,
        planId: parseInt(planId),
      }),
    );

    const createdCoupons = await prisma.coupon.createMany({
      data: couponsData,
      skipDuplicates: true,
    });

    console.log("✅ Coupons created:", createdCoupons.count);

    // 3️⃣ Get campaign with coupons and plan details
    const campaignWithDetails = await prisma.campaign.findUnique({
      where: { id: campaign.id },
      include: {
        coupons: {
          include: {
            plan: {
              select: {
                id: true,
                name: true,
                price: true,
                interval: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Campaign created successfully!",
      campaign: {
        id: campaign.id,
        name: campaign.name,
        createdAt: campaign.createdAt,
        couponCount: createdCoupons.count,
        plan: {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          interval: plan.interval,
        },
      },
      coupons: campaignWithDetails?.coupons || [],
    });
  } catch (error: unknown) {
    console.error("❌ Campaign creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create campaign", error: error },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    // Get all campaigns with their details
    const campaigns = await prisma.campaign.findMany({
      include: {
        coupons: {
          include: {
            plan: {
              select: {
                id: true,
                name: true,
                price: true,
                interval: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      campaigns: campaigns.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        createdAt: campaign.createdAt,
        couponCount: campaign.coupons.length,
        plan: campaign.coupons[0]?.plan || null,
        usedCoupons: campaign.coupons.filter((c) => c.isUsed).length,
        availableCoupons: campaign.coupons.filter((c) => !c.isUsed).length,
      })),
    });
  } catch (error) {
    console.error("❌ Failed to fetch campaigns:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch campaigns" },
      { status: 500 },
    );
  }
}
