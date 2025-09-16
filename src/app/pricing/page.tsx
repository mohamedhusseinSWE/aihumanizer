// src/app/pricing/page.tsx
import PriceSectionClient from "@/components/common/PricingSection";
import { getSession } from "@/lib/getSession";

export default async function PricingPage() {
  const session = await getSession();

  return <PriceSectionClient session={session} />;
}
