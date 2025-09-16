"use server";

import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function updatePlanAction(
  planId: number,
  data: {
    name: string;
    description: string;
    features: string;
    price: number;
    interval: "monthly" | "yearly";
    wordLimitPerRequest: number;
    wordsPerMonth: number;
    status: "ACTIVE" | "HIDDEN" | "DISABLED";
    isPopular: boolean;
    models: string[];
  },
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
