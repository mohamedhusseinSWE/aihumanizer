"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Shield,
  CheckCircle,
  Bot,
  Users,
  Search,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  User,
  ChevronDown,
  Crown,
  Gift,
  LogOut,
  Check,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth-actions";
import HumanizeAI from "@/components/dashboard/HumanizeAI";
import RedeemCode from "@/components/dashboard/RedeemCode";
import Settings from "@/components/dashboard/Settings";
import CancelSubscription from "@/components/dashboard/CancelSubscription";
import Link from "next/link";

type Session = typeof auth.$Infer.Session;

interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number;
  interval: string;
  features?: string;
  isPopular: boolean;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  planName: string | null;
  subscriptionStatus: string | null;
}

export default function DashboardClientPage({ session }: { session: Session }) {
  const router = useRouter();

  const user = session.user;

  const handleSignout = async () => {
    await signOut();
    router.push("/auth");
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [, setUserPlan] = useState<Plan | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (data.success) {
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  // Fetch plans and user profile on component mount
  useEffect(() => {
    fetchPlans();
    fetchUserProfile();
  }, []);

  // Show plans modal when dashboard loads (only for free plan users)
  useEffect(() => {
    if (currentPage === "dashboard" && userProfile) {
      // Only show modal if user has free plan or no plan
      const isFreePlan =
        !userProfile.planName ||
        userProfile.planName.toLowerCase() === "free" ||
        userProfile.planName.toLowerCase() === "free " ||
        userProfile.subscriptionStatus === "free";

      if (isFreePlan) {
        setShowPlansModal(true);
      }
    }
  }, [currentPage, userProfile]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownOpen &&
        !(event.target as Element).closest(".user-dropdown")
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Listen for navigation events from child components
  useEffect(() => {
    const handleNavigateToSettings = () => {
      setCurrentPage("settings");
    };

    window.addEventListener("navigateToSettings", handleNavigateToSettings);
    return () => {
      window.removeEventListener(
        "navigateToSettings",
        handleNavigateToSettings
      );
    };
  }, []);

  const fetchPlans = async () => {
    setLoadingPlans(true);
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      if (data.success) {
        setPlans(data.plans);

        // Set user's current plan - fetch from user profile
        try {
          const profileResponse = await fetch("/api/user/profile");
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData.user?.planId) {
              const currentPlan = data.plans.find(
                (plan: Plan) => plan.id === profileData.user.planId
              );
              setUserPlan(currentPlan || null);
            }
          }
        } catch (profileError) {
          console.error("Failed to fetch user profile:", profileError);
        }
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleUpgradeToPro = async () => {
    try {
      // Find Pro plan
      const proPlan = plans.find((plan) =>
        plan.name.toLowerCase().includes("pro")
      );
      if (proPlan) {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: proPlan.id }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (error) {
      console.error("Failed to start checkout:", error);
    }
  };

  const sidebarItems = {
    writing: [
      {
        id: "humanize-ai",
        icon: Users,
        label: "Humanize AI",
        description: "Make text human-like and undetectable",
      },
      {
        id: "plagiarism-checker",
        icon: Shield,
        label: "Plagiarism Checker",
        description: "Verify content originality",
      },
      {
        id: "ai-detector",
        icon: Bot,
        label: "AI Detector",
        description: "Check for AI generated text",
      },
      {
        id: "grammar-checker",
        icon: CheckCircle,
        label: "Grammar Checker",
        description: "Find and fix grammar issues",
      },
      {
        id: "ai-writer",
        icon: FileText,
        label: "AI Writer",
        description: "AI-powered writing assistant",
      },
      {
        id: "paraphrase-tool",
        icon: Search,
        label: "Paraphrase Tool",
        description: "Rewrite and rephrase text",
      },
    ],
    marketing: [
      {
        id: "ai-article-agent",
        icon: Target,
        label: "AI Article Agent",
        description: "Generate rank-ready articles",
      },
      {
        id: "ai-content-optimizer",
        icon: TrendingUp,
        label: "AI Content Optimizer",
        description: "Optimize content for better performance",
      },
      {
        id: "ai-monitor",
        icon: BarChart3,
        label: "AI Monitor",
        description: "Monitor AI content performance",
      },
      {
        id: "ai-crawler-traffic",
        icon: Zap,
        label: "AI Crawler Traffic",
        description: "Analyze crawler traffic patterns",
      },
    ],
  };

  const DashboardContent = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          Hey! {user?.name || user?.email?.split("@")[0] || "User"} 👋
        </h1>
        <p className="text-gray-600">
          Write and refine your text with AI help. Choose a tool to get started!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Tools */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-gray-200"
          onClick={() => setCurrentPage("humanize-ai")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Humanize AI</CardTitle>
                <CardDescription>
                  Make text human-like and undetectable
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Writer/Editor</CardTitle>
                <CardDescription>
                  Notion like AI editor to create, write, edit documents
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Detector</CardTitle>
                <CardDescription>Check for AI generated text</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Plagiarism Checker</CardTitle>
                <CardDescription>Verify content originality</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Grammar Checker</CardTitle>
                <CardDescription>Find and fix grammar issues</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Search className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Paraphraser</CardTitle>
                <CardDescription>Rewrite and rephrase text</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Target className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  AI Article Agent for SEO+AEO
                </CardTitle>
                <CardDescription>Generate rank-ready articles</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div
            className={`flex items-center space-x-3 ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold">
              H
            </div>
            {sidebarOpen && (
              <Link href="/">
                <span className="font-semibold text-gray-900">
                  {" "}
                  HumanizeAI.com
                </span>
              </Link>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1"
          >
            {sidebarOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Dashboard */}
          <div className="mb-6">
            <Button
              variant={currentPage === "dashboard" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                !sidebarOpen && "justify-center px-2"
              }`}
              onClick={() => setCurrentPage("dashboard")}
            >
              <LayoutDashboard className="w-4 h-4" />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </Button>
          </div>

          {/* Redeem Code */}
          <div className="mb-6">
            <Button
              variant={currentPage === "redeem-code" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                !sidebarOpen && "justify-center px-2"
              }`}
              onClick={() => setCurrentPage("redeem-code")}
            >
              <Gift className="w-4 h-4" />
              {sidebarOpen && <span className="ml-3">Redeem Code</span>}
            </Button>
          </div>

          {/* Writing Section */}
          {sidebarOpen && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Writing
              </h3>
            </div>
          )}
          <div className="space-y-1 mb-6">
            {sidebarItems.writing.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start text-left h-auto p-3 ${
                  !sidebarOpen && "justify-center px-2"
                }`}
                onClick={() => setCurrentPage(item.id)}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && (
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {item.label}
                    </div>
                  </div>
                )}
              </Button>
            ))}
          </div>

          {/* Marketing Section */}
          {sidebarOpen && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Marketing
              </h3>
            </div>
          )}
          <div className="space-y-1">
            {sidebarItems.marketing.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start text-left h-auto p-3 ${
                  !sidebarOpen && "justify-center px-2"
                }`}
                onClick={() => setCurrentPage(item.id)}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && (
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {item.label}
                    </div>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div
            className={`flex items-center ${
              !sidebarOpen && "justify-center"
            } relative`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {user?.name || user?.email?.split("@")[0] || "User"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Dropdown */}
          {sidebarOpen && userDropdownOpen && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 user-dropdown">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    setCurrentPage("redeem-code");
                    setUserDropdownOpen(false);
                  }}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Redeem Code
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    setCurrentPage("settings");
                    setUserDropdownOpen(false);
                  }}
                >
                  Settings
                </button>
                <div className="px-4 py-2">
                  <CancelSubscription
                    userPlan={userProfile?.planName || null}
                    subscriptionStatus={userProfile?.subscriptionStatus || null}
                  />
                </div>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  onClick={handleSignout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {sidebarOpen && (
            <Button
              className="w-full mt-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-medium"
              onClick={handleUpgradeToPro}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {currentPage === "dashboard" && <DashboardContent />}
        {currentPage === "humanize-ai" && <HumanizeAI session={session} />}

        {currentPage === "redeem-code" && <RedeemCode />}
        {currentPage === "settings" && <Settings />}
        {currentPage !== "dashboard" &&
          currentPage !== "humanize-ai" &&
          currentPage !== "redeem-code" &&
          currentPage !== "settings" && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 capitalize">
                {currentPage.replace("-", " ")}
              </h1>
              <p className="text-gray-600">This page is under development.</p>
            </div>
          )}
      </div>

      {/* Plans Modal */}
      {showPlansModal && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Choose Your Plan
                </h2>
                <button
                  onClick={() => setShowPlansModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {loadingPlans ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading plans...</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`flex flex-col justify-between rounded-2xl border shadow-lg p-6 relative ${
                        plan.isPopular
                          ? "bg-purple-800 text-white"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      {/* Popular Badge */}
                      {plan.isPopular && (
                        <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Most Popular
                        </span>
                      )}

                      <div>
                        <h3 className="text-2xl font-semibold mb-2">
                          {plan.name}
                        </h3>
                        <p
                          className={`mb-6 ${
                            plan.isPopular ? "text-purple-200" : "text-gray-500"
                          }`}
                        >
                          {plan.description || "Perfect plan for your needs"}
                        </p>

                        {/* Price */}
                        <div className="text-4xl font-bold mb-1">
                          ${plan.price}
                          <span
                            className={`text-sm font-medium ml-2 ${
                              plan.isPopular
                                ? "text-purple-200"
                                : "text-gray-500"
                            }`}
                          >
                            /{plan.interval}
                          </span>
                        </div>

                        {/* Features */}
                        <ul className="mt-6 space-y-3">
                          {(plan.features?.split(/[\n,]+/) || []).map(
                            (feature: string) => (
                              <li
                                key={feature.trim()}
                                className="flex items-start space-x-2 text-sm"
                              >
                                <Check
                                  className={`w-4 h-4 mt-1 flex-shrink-0 ${
                                    plan.isPopular
                                      ? "text-green-300"
                                      : "text-green-500"
                                  }`}
                                />
                                <span>{feature.trim()}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <Button
                        className={`w-full mt-8 ${
                          plan.isPopular
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/stripe/checkout", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ planId: plan.id }),
                            });
                            const data = await res.json();
                            if (data.url) {
                              window.location.href = data.url;
                            }
                          } catch (error) {
                            console.error("Failed to start checkout:", error);
                          }
                        }}
                      >
                        Buy Now
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowPlansModal(false)}
                  className="text-gray-500 hover:text-gray-700 underline"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
