import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("id");

    if (!campaignId) {
      return NextResponse.json(
        { success: false, message: "Campaign ID is required" },
        { status: 400 },
      );
    }

    const id = parseInt(campaignId);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid campaign ID" },
        { status: 400 },
      );
    }

    console.log("📤 Exporting coupons for campaign:", id);

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        coupons: {
          include: {
            plan: {
              select: {
                name: true,
                price: true,
                interval: true,
              },
            },
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 },
      );
    }

    if (campaign.coupons.length === 0) {
      return NextResponse.json(
        { success: false, message: "No coupons found for this campaign" },
        { status: 404 },
      );
    }

    // Prepare CSV data
    const csvData = campaign.coupons.map((coupon) => ({
      code: coupon.code,
      plan: coupon.plan.name,
      price: coupon.plan.price,
      interval: coupon.plan.interval,
      isUsed: coupon.isUsed ? "Yes" : "No",
      usedBy: coupon.user?.email || "N/A",
      userName: coupon.user?.name || "N/A",
      createdAt: coupon.createdAt.toISOString().split("T")[0],
    }));

    // Convert to CSV format
    const headers = [
      "Code",
      "Plan",
      "Price",
      "Interval",
      "Used",
      "Used By",
      "User Name",
      "Created At",
    ];
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        [
          `"${row.code}"`,
          `"${row.plan}"`,
          row.price,
          `"${row.interval}"`,
          row.isUsed,
          `"${row.usedBy}"`,
          `"${row.userName}"`,
          row.createdAt,
        ].join(","),
      ),
    ].join("\n");

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${campaign.name.replace(/\s+/g, "_")}_coupons.csv"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("❌ Export coupons error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to export coupons",
        error: error,
      },
      { status: 500 },
    );
  }
}
