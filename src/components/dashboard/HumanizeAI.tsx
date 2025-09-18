"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Zap,
  Upload,
  Radio,
  Copy,
  Download,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  MoreHorizontal,
} from "lucide-react";
import { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;


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

interface HumanizationJob {
  id: number;
  inputText: string;
  outputText: string | null;
  wordCount: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  completedAt: string | null;
}

export default function HumanizeAI({ session }: { session: Session }) {

  
    

  const [selectedMode, setSelectedMode] = useState<"balanced" | "ultra">(
    "balanced",
  );
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [inputWordCount, setInputWordCount] = useState(0);
  const [outputWordCount, setOutputWordCount] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [proPlan, setProPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [jobHistory, setJobHistory] = useState<HumanizationJob[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [isDuplicateUser, setIsDuplicateUser] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [inputFontSize, setInputFontSize] = useState("14pt");
  const [outputFontSize, setOutputFontSize] = useState("14pt");

  useEffect(() => {
    fetchUserData();
    fetchJobHistory();
    checkDuplicateRegistration();
  }, []);

  useEffect(() => {
    const words = inputText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    setInputWordCount(words);
  }, [inputText]);

  useEffect(() => {
    const words = outputText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    setOutputWordCount(words);
  }, [outputText]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = await response.json();
      if (data.success) {
        setUserData(data.user);

        // Fetch all plans to get user's current plan and Pro plan
        const planResponse = await fetch("/api/admin/plans");
        const planData = await planResponse.json();
        if (planData.success) {
          const plans = planData.plans as Plan[];

          // Set user's current plan
          if (data.user.planId) {
            const currentPlan = plans.find(
              (plan: Plan) => plan.id === data.user.planId,
            );
            setUserPlan(currentPlan || null);
          }

          // Find Pro plan dynamically (look for plan with "pro" in name, case insensitive)
          const proPlanFound = plans.find(
            (plan: Plan) =>
              plan.name.toLowerCase().includes("pro") &&
              plan.status === "ACTIVE" &&
              plan.price > 0,
          );
          setProPlan(proPlanFound || null);

          console.log("Pro plan found:", proPlanFound);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobHistory = async () => {
    try {
      const response = await fetch("/api/user/humanization-jobs?limit=20");
      const data = await response.json();
      if (data.success) {
        setJobHistory(data.jobs);
      }
    } catch (error) {
      console.error("Failed to fetch job history:", error);
    }
  };

  const checkDuplicateRegistration = async () => {
    try {
      const response = await fetch("/api/user/check-duplicate-ip");
      const data = await response.json();
      if (data.success) {
        setIsDuplicateUser(data.isDuplicateRegistration);
        setDuplicateMessage(data.message);
        if (data.isDuplicateRegistration) {
          setShowDuplicateModal(true);
        }
      }
    } catch (error) {
      console.error("Failed to check duplicate registration:", error);
    }
  };

  const handleUltraMode = async () => {
    if (selectedMode === "ultra") return; // Already selected

    // Check if user has a paid plan
    const isPaidUser =
      userData?.planId && userData?.planName && userData.planName !== "free";

    if (!isPaidUser) {
      // Check if Pro plan is available
      if (!proPlan) {
        console.error("Pro plan not found");
        return;
      }

      // Redirect to Stripe checkout for Pro plan
      try {
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: proPlan.id,
            planName: proPlan.name,
          }),
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error("Failed to create checkout session:", error);
      }
    } else {
      // Just switch to ultra mode
      setSelectedMode("ultra");
    }
  };

  const handleAccount = async () => {
    // Check if user has a paid plan
    const isPaidUser =
      userData?.planId && userData?.planName && userData.planName !== "free";

    if (!isPaidUser) {
      // Check if Pro plan is available
      if (!proPlan) {
        console.error("Pro plan not found");
        return;
      }

      // Redirect to Stripe checkout for Pro plan
      try {
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: proPlan.id,
            planName: proPlan.name,
          }),
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error("Failed to create checkout session:", error);
      }
    } else {
      // Redirect to settings - we need to trigger the parent component to switch to settings
      // Since this is a component within the dashboard, we'll use a custom event
      window.dispatchEvent(new CustomEvent("navigateToSettings"));
    }
  };

  const checkWordLimit = () => {
    // Check if user has word limit restrictions
    if (!userPlan) {
      // Free user - check if free plan is disabled or has zero word limit
      return inputWordCount > 0; // Allow any text for free users for now
    }

    // Check word limit per request
    if (
      userPlan.wordLimitPerRequest > 0 &&
      inputWordCount > userPlan.wordLimitPerRequest
    ) {
      return false;
    }

    return true;
  };

  const handleHumanize = async () => {
    // Check if user is a duplicate registration
    if (isDuplicateUser) {
      setShowDuplicateModal(true);
      return;
    }

    // Check word limits
    if (!checkWordLimit()) {
      setShowTrialModal(true);
      return;
    }

    // Check if free plan is disabled
    if (!userPlan || userPlan.status === "DISABLED") {
      setShowTrialModal(true);
      return;
    }

    setIsHumanizing(true);
    setCurrentJobId(null);

    try {
      // Call the humanization API
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          mode: selectedMode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOutputText(data.humanizedText);
        setCurrentJobId(data.jobId);
        // Refresh job history
        await fetchJobHistory();
      } else {
        console.error("Humanization failed:", data.error);
        // Fallback to a simple message if API fails
        setOutputText(
          "Sorry, there was an error humanizing your text. Please try again.",
        );
      }
    } catch (error) {
      console.error("Humanization failed:", error);
      setOutputText(
        "Sorry, there was an error humanizing your text. Please try again.",
      );
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleActivateTrial = async () => {
    setShowTrialModal(false);

    // Check if Pro plan is available
    if (!proPlan) {
      console.error("Pro plan not found");
      return;
    }

    // Redirect to Stripe checkout for Pro plan
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: proPlan.id,
          planName: proPlan.name,
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

  const handleUpgradeForDuplicate = async () => {
    setShowDuplicateModal(false);

    // Check if Pro plan is available
    if (!proPlan) {
      console.error("Pro plan not found");
      return;
    }

    // Redirect to Stripe checkout for Pro plan
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: proPlan.id,
          planName: proPlan.name,
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

  const copyOutput = () => {
    navigator.clipboard.writeText(outputText);
  };

  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "humanized-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadJob = (job: HumanizationJob) => {
    setInputText(job.inputText);
    setOutputText(job.outputText || "");
    setCurrentJobId(job.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-100";
      case "PROCESSING":
        return "text-blue-600 bg-blue-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "FAILED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Duplicate User Warning */}
        {isDuplicateUser && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Multiple Account Detection
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{duplicateMessage}</p>
                </div>
                <div className="mt-3">
                  <Button
                    onClick={handleUpgradeForDuplicate}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Upgrade to Pro Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Humanize AI Text with the Best AI Humanizer
          </h1>

          <div className="flex justify-center items-center space-x-4 mb-6">
            <Button
              variant={selectedMode === "balanced" ? "default" : "outline"}
              className={`flex items-center space-x-2 ${
                selectedMode === "balanced"
                  ? "bg-gray-900 hover:bg-gray-800 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedMode("balanced")}
            >
              <Radio className="w-4 h-4" />
              <span>Balanced mode</span>
            </Button>
            <Button
              variant={selectedMode === "ultra" ? "default" : "outline"}
              className={`flex items-center space-x-2 ${
                selectedMode === "ultra"
                  ? "bg-gray-900 hover:bg-gray-800 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={handleUltraMode}
            >
              <Zap className="w-4 h-4" />
              <span>Ultra mode</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              onClick={handleAccount}
            >
              <Zap className="w-4 h-4" />
              <span>Account</span>
            </Button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Humanize Text
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputText("")}
              >
                Clear Editors
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-3 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  AI Text
                </h4>
                {/* Rich Text Editor Toolbar */}
                <div className="flex items-center space-x-2 mb-2">
                  <Button variant="ghost" size="sm">
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Redo className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <Button variant="ghost" size="sm">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Underline className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Strikethrough className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <select className="text-sm border-0 bg-transparent">
                    <option>Verdana</option>
                  </select>
                  <select
                    className="text-sm border-0 bg-transparent"
                    value={inputFontSize}
                    onChange={e => setInputFontSize(e.target.value)}
                  >
                    <option>10pt</option>
                    <option>12pt</option>
                    <option>14pt</option>
                    <option>16pt</option>
                    <option>18pt</option>
                    <option>20pt</option>
                    <option>24pt</option>
                    <option>28pt</option>
                    <option>32pt</option>
                  </select>
                  <select className="text-sm border-0 bg-transparent">
                    <option>Paragraph</option>
                  </select>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <Textarea
                  placeholder={
                    isDuplicateUser
                      ? "Upgrade to Pro plan to use this feature"
                      : "Enter Text to Humanize (for better results, enter 100 words or above) or Try the below examples"
                  }
                  className="min-h-[300px] resize-none border-0 focus:ring-0 p-0"
                  style={{ fontSize: inputFontSize }}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isDuplicateUser}
                />
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Humanized Text
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyOutput}
                  disabled={!outputText}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Result
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadOutput}
                  disabled={!outputText}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>

                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4"
                  onClick={handleHumanize}
                  disabled={!inputText || isHumanizing || isDuplicateUser}
                >
                  {isHumanizing
                    ? "Humanizing..."
                    : isDuplicateUser
                      ? "Upgrade Required"
                      : "Humanize"}
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-3 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Humanized Text
                </h4>
                {/* Rich Text Editor Toolbar */}
                <div className="flex items-center space-x-2 mb-2">
                  <Button variant="ghost" size="sm">
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Redo className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <Button variant="ghost" size="sm">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Underline className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Strikethrough className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <select className="text-sm border-0 bg-transparent">
                    <option>Verdana</option>
                  </select>
                  <select
                    className="text-sm border-0 bg-transparent"
                    value={outputFontSize}
                    onChange={e => setOutputFontSize(e.target.value)}
                  >
                    <option>10pt</option>
                    <option>12pt</option>
                    <option>14pt</option>
                    <option>16pt</option>
                    <option>18pt</option>
                    <option>20pt</option>
                    <option>24pt</option>
                    <option>28pt</option>
                    <option>32pt</option>
                  </select>
                  <select className="text-sm border-0 bg-transparent">
                    <option>Paragraph</option>
                  </select>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <Textarea
                  placeholder="Humanized text will appear here..."
                  className="min-h-[300px] resize-none border-0 focus:ring-0 p-0"
                  style={{ fontSize: outputFontSize }}
                  value={outputText}
                  readOnly
                />
              </div>
            </div>

            {/* Word Count Display */}
            <div className="text-sm text-gray-500">
              {outputWordCount > 0 && (
                <p>
                  {outputWordCount} words
                  {userPlan && (
                    <span className="ml-2">
                      (Plan: {userPlan.name} - Limit:{" "}
                      {userPlan.wordLimitPerRequest === 0
                        ? "Unlimited"
                        : userPlan.wordLimitPerRequest}{" "}
                      words per request)
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Upload File Button */}
        <div className="mt-6 flex justify-center">
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </Button>
        </div>

        {/* Job History Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Humanizations
            </h3>
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2"
            >
              <span>{showHistory ? "Hide" : "Show"} History</span>
            </Button>
          </div>

          {showHistory && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              {jobHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No humanization jobs yet
                </p>
              ) : (
                <div className="space-y-3">
                  {jobHistory.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        currentJobId === job.id
                          ? "border-purple-300 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => loadJob(job)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            Job #{job.id}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {job.inputText.substring(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {job.wordCount} words
                        </span>
                        {job.completedAt && (
                          <span className="text-xs text-gray-500">
                            Completed:{" "}
                            {new Date(job.completedAt).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trial Modal */}
      {showTrialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">i</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Activate Free Trial
              </h2>
              <p className="text-gray-600 mb-6">
                You need to activate your free trial account.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTrialModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleActivateTrial}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Activate Free Trial
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate User Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Multiple Account Detected
              </h2>
              <p className="text-gray-600 mb-6">
                This IP address has been used to create multiple accounts. To
                continue using our service, please upgrade to the Pro plan.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDuplicateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpgradeForDuplicate}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Upgrade to Pro Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
