"use server";

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export type UpdatePlanInput = {
  name: string;
  description: string;
  features: string;
  price: number;
  interval: "monthly" | "yearly" | "lifetime"; // <-- Add "lifetime"
  wordLimitPerRequest: number;
  wordsPerMonth: number;
  status: "ACTIVE" | "HIDDEN" | "DISABLED";
  isPopular: boolean;
  models: string[];
  priceId: string; // <-- Add this if missing
};

export async function updatePlanAction(
  planId: number,
  data: UpdatePlanInput,
) {
  try {
    await prisma.plan.update({
      where: { id: planId },
      data: {
        name: data.name,
        description: data.description,
        features: data.features,
        price: data.price,
        interval: data.interval,
        wordLimitPerRequest: data.wordLimitPerRequest,
        wordsPerMonth: data.wordsPerMonth,
        status: data.status,
        isPopular: data.isPopular,
        models: data.models,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Update plan failed:", error);
    return { success: false, message: "Failed to update plan" };
  }
}
