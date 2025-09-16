const { PrismaClient } = require("./src/generated/prisma");

const prisma = new PrismaClient();

async function updateUserSubscription() {
  try {
    console.log("🔄 Updating user subscription...");

    // Update the specific user who tried to upgrade
    const userId = "rX38N1DFFLwOwX6iyKPn0Lt2TblheIK9";
    const planId = 1;

    // Get plan details
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      console.log("❌ Plan not found");
      return;
    }

    console.log(`📦 Plan found: ${plan.name} ($${plan.price})`);

    // Update user subscription data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        planId: planId,
        planName: plan.name,
        subscriptionId: "sub_" + Date.now() + "_" + userId,
        subscriptionStatus: "active",
      },
    });

    console.log("✅ User updated successfully:", {
      id: updatedUser.id,
      email: updatedUser.email,
      planId: updatedUser.planId,
      planName: updatedUser.planName,
      subscriptionId: updatedUser.subscriptionId,
      subscriptionStatus: updatedUser.subscriptionStatus,
    });

    // Create subscription record
    const subscription = await prisma.subscription.create({
      data: {
        stripeSubId: "sub_" + Date.now() + "_" + userId,
        userId: userId,
        planId: planId,
        status: "active",
        interval: plan.interval,
        startDate: new Date(),
        endDate: null,
      },
    });

    console.log("✅ Subscription record created:", subscription.id);

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: plan.price,
        status: "paid",
        stripe_payment_id: "pi_" + Date.now(),
        price_id: plan.priceId || "manual_upgrade",
        user_email: updatedUser.email,
        userId: userId,
      },
    });

    console.log("✅ Payment record created:", payment.id);

    // Show all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        planId: true,
        planName: true,
        subscriptionId: true,
        subscriptionStatus: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("\n📊 All users in database:");
    console.log(JSON.stringify(allUsers, null, 2));
  } catch (error) {
    console.error("❌ Error updating database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserSubscription();
