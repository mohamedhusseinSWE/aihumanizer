"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Database,
  Shield,
  CreditCard,
  Zap,
  Globe,
  Smartphone,
  Palette,
  Layers,
  Server,
  Lock,
  Bot,
  Cloud,
  Settings as SettingsIcon,
  Info,
  Wrench,
  CheckCircle,
  Star,
  ArrowRight,
  Calendar,
} from "lucide-react";

const AdminSettings = () => {
  const techStack = {
    frontend: [
      {
        name: "Next.js 15.5.3",
        description: "React framework with App Router",
        icon: <Layers className="w-6 h-6 text-blue-600" />,
        features: ["Server Components", "App Router", "API Routes", "SSR/SSG"],
      },
      {
        name: "React 19.1.0",
        description: "Latest React with concurrent features",
        icon: <Code className="w-6 h-6 text-cyan-600" />,
        features: ["Concurrent Rendering", "Suspense", "Hooks", "TypeScript"],
      },
      {
        name: "shadcn/ui",
        description: "Modern component library",
        icon: <Palette className="w-6 h-6 text-purple-600" />,
        features: ["Radix UI", "Tailwind CSS", "Accessible", "Customizable"],
      },
      {
        name: "Lucide React",
        description: "Beautiful icon library",
        icon: <Star className="w-6 h-6 text-yellow-600" />,
        features: ["1000+ Icons", "Tree Shaking", "Customizable", "Consistent"],
      },
      {
        name: "Tailwind CSS 4",
        description: "Utility-first CSS framework",
        icon: <Palette className="w-6 h-6 text-teal-600" />,
        features: [
          "Responsive Design",
          "Dark Mode",
          "Custom Design",
          "Performance",
        ],
      },
    ],
    backend: [
      {
        name: "Server Actions",
        description: "Next.js server-side functions",
        icon: <Server className="w-6 h-6 text-green-600" />,
        features: [
          "Type Safety",
          "Form Handling",
          "Progressive Enhancement",
          "Caching",
        ],
      },
      {
        name: "PostgreSQL",
        description: "Advanced relational database",
        icon: <Database className="w-6 h-6 text-blue-700" />,
        features: [
          "ACID Compliance",
          "JSON Support",
          "Full-text Search",
          "Scalability",
        ],
      },
      {
        name: "Prisma ORM",
        description: "Type-safe database toolkit",
        icon: <Database className="w-6 h-6 text-indigo-600" />,
        features: [
          "Type Safety",
          "Migrations",
          "Query Builder",
          "Schema Management",
        ],
      },
      {
        name: "better-auth",
        description: "Modern authentication library",
        icon: <Shield className="w-6 h-6 text-red-600" />,
        features: [
          "OAuth Providers",
          "Session Management",
          "Security",
          "TypeScript",
        ],
      },
    ],
    integrations: [
      {
        name: "OpenAI API",
        description: "AI text humanization",
        icon: <Bot className="w-6 h-6 text-green-500" />,
        features: [
          "Claude 3.5 Sonnet",
          "Text Processing",
          "AI Humanization",
          "Quality Output",
        ],
      },
      {
        name: "Stripe",
        description: "Payment processing",
        icon: <CreditCard className="w-6 h-6 text-purple-600" />,
        features: ["Subscriptions", "Webhooks", "Security", "Global Support"],
      },
      {
        name: "Cloudflare Turnstile",
        description: "Bot protection",
        icon: <Lock className="w-6 h-6 text-orange-600" />,
        features: [
          "CAPTCHA Alternative",
          "Privacy-focused",
          "Fast",
          "Effective",
        ],
      },
      {
        name: "Google OAuth",
        description: "Social authentication",
        icon: <Globe className="w-6 h-6 text-blue-500" />,
        features: [
          "One-click Login",
          "Secure",
          "User-friendly",
          "Wide Adoption",
        ],
      },
    ],
    features: [
      {
        name: "Responsive Design",
        description: "Mobile-first approach",
        icon: <Smartphone className="w-6 h-6 text-pink-600" />,
        features: [
          "Mobile Optimized",
          "Tablet Support",
          "Desktop Enhanced",
          "Touch Friendly",
        ],
      },
      {
        name: "Real-time Updates",
        description: "Live data synchronization",
        icon: <Zap className="w-6 h-6 text-yellow-500" />,
        features: [
          "Live Dashboard",
          "Instant Updates",
          "WebSocket Ready",
          "Performance",
        ],
      },
      {
        name: "Admin Panel",
        description: "Comprehensive management",
        icon: <SettingsIcon className="w-6 h-6 text-gray-600" />,
        features: [
          "User Management",
          "Subscription Control",
          "Analytics",
          "Campaign Tools",
        ],
      },
    ],
  };

  const adminInfo = {
    systemVersion: "1.0.0",
    lastUpdated: new Date().toLocaleDateString(),
    totalUsers: "Dynamic",
    activeSubscriptions: "Real-time",
    systemStatus: "Operational",
    uptime: "99.9%",
    securityLevel: "High",
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-2">
            System information and technology stack overview
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800 px-4 py-2">
          <CheckCircle className="w-4 h-4 mr-2" />
          System Operational
        </Badge>
      </div>

      {/* Admin System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-6 h-6 text-blue-600" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">
                  Version
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {adminInfo.systemVersion}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">
                  Last Updated
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {adminInfo.lastUpdated}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">
                  Security Level
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {adminInfo.securityLevel}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">
                  Uptime
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {adminInfo.uptime}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Frontend Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-600" />
            Frontend Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.frontend.map((tech, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  {tech.icon}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-gray-600">{tech.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {tech.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backend Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-6 h-6 text-green-600" />
            Backend Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.backend.map((tech, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  {tech.icon}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-gray-600">{tech.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {tech.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-purple-600" />
            Third-party Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.integrations.map((tech, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  {tech.icon}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-gray-600">{tech.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {tech.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-orange-600" />
            System Features & Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techStack.features.map((feature, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  {feature.icon}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Architecture Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            System Architecture Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Frontend Layer</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Next.js 15 with React 19, shadcn/ui components, and Tailwind
                  CSS for responsive design
                </p>
                <div className="space-y-1">
                  <Badge variant="outline">Next.js 15.5.3</Badge>
                  <Badge variant="outline">React 19.1.0</Badge>
                  <Badge variant="outline">shadcn/ui</Badge>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Server className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Backend Layer</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Server Actions, PostgreSQL database with Prisma ORM, and
                  better-auth for security
                </p>
                <div className="space-y-1">
                  <Badge variant="outline">Server Actions</Badge>
                  <Badge variant="outline">PostgreSQL</Badge>
                  <Badge variant="outline">Prisma ORM</Badge>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Cloud className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Integration Layer
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  OpenAI for AI processing, Stripe for payments, and Cloudflare
                  for security
                </p>
                <div className="space-y-1">
                  <Badge variant="outline">OpenAI API</Badge>
                  <Badge variant="outline">Stripe</Badge>
                  <Badge variant="outline">Cloudflare</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-600" />
            Performance & Security Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                99.9%
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                &lt;100ms
              </div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">A+</div>
              <div className="text-sm text-gray-600">Security Grade</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                100%
              </div>
              <div className="text-sm text-gray-600">Mobile Responsive</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
