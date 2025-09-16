import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import crypto from "crypto";

const prisma = new PrismaClient();

// Refgrow webhook secret for verification
const REFGROW_WEBHOOK_SECRET = process.env.REFGROW_WEBHOOK_SECRET;

interface RefgrowCommissionData {
  commissionId: string;
  amount: number;
  affiliateId: string;
  paidAt?: string;
}

interface RefgrowAffiliateUpdateData {
  affiliateId: string;
  status?: string;
  updatedFields?: {
    status?: string;
    name?: string;
    email?: string;
    [key: string]: unknown;
  };
}

interface RefgrowWebhookEvent<T = unknown> {
  type: string;
  data: T;
}

function verifyRefgrowWebhook(payload: string, signature: string): boolean {
  if (!REFGROW_WEBHOOK_SECRET) {
    console.log("Refgrow webhook secret not configured, skipping verification");
    return true; // Allow in development
  }

  const expectedSignature = crypto
    .createHmac("sha256", REFGROW_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-refgrow-signature") || "";

    // Verify webhook signature
    if (!verifyRefgrowWebhook(payload, signature)) {
      console.error("Invalid Refgrow webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event: RefgrowWebhookEvent = JSON.parse(payload);
    console.log("Received Refgrow webhook:", event.type);

    switch (event.type) {
      case "commission.approved":
        await handleCommissionApproved(event.data as RefgrowCommissionData);
        break;

      case "commission.paid":
        await handleCommissionPaid(event.data as RefgrowCommissionData);
        break;

      case "affiliate.updated":
        await handleAffiliateUpdated(event.data as RefgrowAffiliateUpdateData);
        break;

      default:
        console.log(`Unhandled Refgrow webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Refgrow webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function handleCommissionApproved(data: RefgrowCommissionData) {
  try {
    const { commissionId, amount, affiliateId } = data;

    // Update commission status in database
    await prisma.affiliateCommission.updateMany({
      where: {
        affiliateId: affiliateId,
        amount: amount,
        status: "PENDING",
      },
      data: {
        status: "APPROVED",
      },
    });

    console.log(
      `Commission approved: ${commissionId} for affiliate ${affiliateId}`,
    );
  } catch (error: unknown) {
    console.error("Error handling commission approval:", error);
  }
}

async function handleCommissionPaid(data: RefgrowCommissionData) {
  try {
    const { commissionId, amount, affiliateId, paidAt } = data;

    // Update commission status in database
    await prisma.affiliateCommission.updateMany({
      where: {
        affiliateId: affiliateId,
        amount: amount,
        status: "APPROVED",
      },
      data: {
        status: "PAID",
        paidAt: paidAt ? new Date(paidAt) : undefined,
      },
    });

    console.log(
      `Commission paid: ${commissionId} for affiliate ${affiliateId}`,
    );
  } catch (error: unknown) {
    console.error("Error handling commission payment:", error);
  }
}

async function handleAffiliateUpdated(data: RefgrowAffiliateUpdateData) {
  try {
    const { affiliateId, updatedFields } = data;

    if (updatedFields) {
      const updateData: Partial<{
        status: string;
        name: string;
        email: string;
      }> = {};

      if (updatedFields.status) updateData.status = updatedFields.status;
      if (updatedFields.name) updateData.name = updatedFields.name;
      if (updatedFields.email) updateData.email = updatedFields.email;

      if (Object.keys(updateData).length > 0) {
        await prisma.user.updateMany({
          where: { affiliateId },
          data: updateData,
        });
      }
    }

    console.log(`Affiliate updated: ${affiliateId}`);
  } catch (error: unknown) {
    console.error("Error handling affiliate update:", error);
  }
}
