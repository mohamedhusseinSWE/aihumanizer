"use client";

import React, { useState, useEffect } from "react";
import { Copy, Clipboard, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  name: string;
  email: string;
  planId: number | null;
  planName: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
}

interface Plan {
  id: number;
  name: string;
  wordLimitPerRequest: number;
  wordsPerMonth: number;
  status: string;
  price: number;
  priceId: string | null;
}

const StealthgptSection = () => {
  const [text, setText] = useState("");
  const [enhancedModel, setEnhancedModel] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [proPlan, setProPlan] = useState<Plan | null>(null);
  const [, setLoading] = useState(true);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const router = useRouter();

  const sampleText =
    "Paris, the capital of France, is one of the most iconic cities in the world, known for its rich history, stunning architecture, and vibrant culture. Often called 'La Ville Lumière' (The City of Light), Paris has been a center of art, fashion, philosophy, and science for centuries. With a population of over 2 million people in its city proper and over 11 million in the metropolitan area, Paris is also a major hub of commerce, politics, and education.";

  useEffect(() => {
    fetchUserData();
    fetchPlans();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/admin/plans");
      if (response.ok) {
        const data = await response.json();
        // Find the Pro plan (assuming it's the first paid plan or has "Pro" in the name)
        const proPlanData = data.plans.find(
          (plan: Plan) =>
            plan.name.toLowerCase().includes("pro") || plan.price > 0
        );
        setProPlan(proPlanData);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  };

  const handleSampleAIText = () => {
    setText(sampleText);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      // Fallback for older browsers or if permission is denied
      alert("Please paste manually using Ctrl+V");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text to clipboard");
    }
  };

  const handleVerifyResult = () => {
    window.open("https://www.grammarly.com/ai-detector", "_blank");
  };

  const handleEnhancedModelToggle = (checked: boolean) => {
    setEnhancedModel(checked);

    // If user is not logged in or has free plan, show modal
    if (
      !userData ||
      !userData.planId ||
      userData.subscriptionStatus === "free"
    ) {
      setShowTrialModal(true);
      return;
    }
  };

  const handleActivateTrial = async () => {
    setShowTrialModal(false);

    // Check if Pro plan is available
    if (!proPlan) {
      console.error("Pro plan not found");
      return;
    }

    // Get referral code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get("ref");

    // Redirect to Stripe checkout for Pro plan
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: proPlan.id.toString(),
          planName: proPlan.name,
          referralCode: referralCode, // Include referral code if present
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    }
  };

  const handleHumanize = () => {
    // If user is not logged in, redirect to auth
    if (!userData) {
      router.push("/auth");
      return;
    }

    // If user has free plan, show modal
    if (!userData.planId || userData.subscriptionStatus === "free") {
      setShowTrialModal(true);
      return;
    }

    // If user has paid plan, redirect to dashboard
    router.push("/dashboard");
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="text-center mb-12 mt-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Humanize AI Text with
          <br />
          Best StealthGPT Alternative
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          See why content writers are switching from StealthGPT to AIHumanizer
          for better results.
        </p>
      </div>
      <div className="space-y-4">
        {/* Button Row */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handlePaste}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Clipboard className="w-4 h-4" />
            Paste
          </Button>

          <Button
            variant="outline"
            onClick={handleSampleAIText}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <FileText className="w-4 h-4" />
            Sample AI Text
          </Button>

          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!text.trim()}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>

          <Button
            variant="outline"
            onClick={handleVerifyResult}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink className="w-4 h-4" />
            Verify Result
          </Button>
        </div>

        {/* Textarea */}
        <div className="relative">
          <Textarea
            placeholder="Enter Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[300px] resize-none border-2 border-gray-300 rounded-lg p-4 text-base focus:border-blue-500 focus:ring-0"
          />
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Switch
              id="enhanced-model"
              checked={enhancedModel}
              onCheckedChange={handleEnhancedModelToggle}
              className="data-[state=checked]:bg-gray-600"
            />
            <Label
              htmlFor="enhanced-model"
              className="text-blue-600 font-medium text-base cursor-pointer"
            >
              Enhanced Model
            </Label>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-gray-600 text-sm">
              Words: {wordCount}/300
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 text-gray-600 text-xs">
                i
              </span>
            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-medium"
              disabled={!text.trim()}
              onClick={handleHumanize}
            >
              Humanize
            </Button>
          </div>
        </div>
      </div>

      {/* Trial Modal */}
      {showTrialModal && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">✨</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Upgrade to Pro
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Unlock the enhanced model and get access to unlimited
                humanization with our Pro plan.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleActivateTrial}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-medium shadow-lg"
                >
                  Upgrade to Pro Plan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTrialModal(false)}
                  className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 py-3 rounded-lg"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StealthgptSection;
