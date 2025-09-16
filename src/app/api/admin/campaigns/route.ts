import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        coupons: {
          select: {
            id: true,
            isUsed: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedCampaigns = campaigns.map((campaign) => {
      // pick first coupon's plan (if exists)
      const firstPlan =
        campaign.coupons.length > 0 ? campaign.coupons[0].plan : null;

      return {
        id: campaign.id,
        name: campaign.name,
        plan: firstPlan, // ✅ single plan object or null
        couponCount: campaign.coupons.length,
        usedCoupons: campaign.coupons.filter((c) => c.isUsed).length,
        availableCoupons: campaign.coupons.filter((c) => !c.isUsed).length,
        createdAt: campaign.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      campaigns: formattedCampaigns,
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campaigns" },
      { status: 500 },
    );
  }
}
