import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClientPage from "./dashboard-client";
import HumanizeAI from "@/components/dashboard/HumanizeAI";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  return <HumanizeAI session={session} />;
}
