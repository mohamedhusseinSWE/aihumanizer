import BypassAISection from "@/components/common/BypassAISection";
import BypassAISection2 from "@/components/common/BypassAISection2";
import CTASection from "@/components/common/CTASection";
import DetectionMeter from "@/components/common/DetectionMeter";
import FAQSection from "@/components/common/FAQSection";
import FeaturesSection from "@/components/common/FeaturesSection";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import HeroSection from "@/components/common/HeroSection";
import PriceSectionClient from "@/components/common/PricingSection";
import ResultDemo from "@/components/common/ResultDemo";
import TargetAudience from "@/components/common/TargetAudience";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";

export default async function HomePage() {
  // Get session for pricing component
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <Header />

      {/* Hero Section with Text Input */}
      <HeroSection />

      {/* Result Demo with Before/After Text */}
      <ResultDemo />

      {/* AI Detection Meters */}
      <DetectionMeter />

      {/* Export Formats and Integrations */}
      <FeaturesSection />

      {/* Bypass AI Detection Section */}
      <BypassAISection />

      <BypassAISection2 />

      {/* Target Audience (Who needs AI Humanizer) */}
      <TargetAudience />

      {/* Pricing Plans */}
      <PriceSectionClient session={session} />

      {/* Call to Action with Document Preview */}
      <CTASection />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
