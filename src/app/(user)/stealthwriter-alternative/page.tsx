import CTASection from "@/components/common/CTASection";
import FAQSection from "@/components/common/FAQSection";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import React from "react";
import WriterSection from "./WriterSection";
import Features from "./Features";
import BypassAISection from "./BypassAISection";
import BypassAISection2 from "./BypassAISection2";

export default async function HomePage() {
  // Get session for pricing component

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <Header />

      {/* Hero Section with Text Input */}
      <WriterSection />

      <Features />

      {/* Bypass AI Detection Section */}
      <BypassAISection />

      <BypassAISection2 />

      {/* Call to Action with Document Preview */}
      <CTASection />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
