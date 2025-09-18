









import CTASection from "@/components/common/CTASection";
import FAQSection from "@/components/common/FAQSection";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import React from "react";
import StealthgptSection from "./StealthgptSection";
import Features from "./Features";
import BypassAISection from "./BypassAISection";
import BypassAISection2 from "./BypassAISection2";

export default async function HomePage() {
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <Header />

      {/* Hero Section with Text Input */}
      <StealthgptSection />

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
