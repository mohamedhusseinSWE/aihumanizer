"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bug, Zap } from "lucide-react";
import Image from "next/image";

const TargetAudience = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Three Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Content Writers Card */}
          <Card className="p-6 bg-white border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Content Writers
              </h3>
              <p className="text-gray-600 mb-6">
                Refine AI-generated articles, blogs, and copy into natural,
                engaging content that connects with readers.
              </p>

              {/* Content Ideas Section with Image */}
              <div className="bg-gray-50 rounded-lg p-4">
                <Image
                  src="/images/content-writers.png"
                  alt="Content Writers Interface"
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-lg mb-4"
                />
              </div>
            </CardContent>
          </Card>

          {/* Students and Researchers Card */}
          <Card className="p-6 bg-white border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Students and Researchers
              </h3>
              <p className="text-gray-600 mb-6">
                Quickly turn AI-generated drafts into natural, original content
                that passes AI detection and academic checks.
              </p>

              {/* Academic Workflow with Image */}
              <div className="bg-gray-50 rounded-lg p-4">
                <Image
                  src="/images/academic-paper-research-assistant.png"
                  alt="Academic Paper Research Assistant"
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Professionals Card */}
          <Card className="p-6 bg-white border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Business Professionals
              </h3>
              <p className="text-gray-600 mb-6">
                Polish emails, reports, and proposals with human-like language
                that enhances clarity and professionalism.
              </p>

              {/* Changelog Section with Image */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-800">Changelog</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-3 py-1"
                  >
                    What&apos;s new
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      26 Jan, 2024
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Layout variation design
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1">
                          <Sparkles className="w-3 h-3 mr-1" />
                          New
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Three placeholder lines...
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
                          <Zap className="w-3 h-3 mr-1" />
                          Improvements
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Three placeholder lines...
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className="bg-red-100 text-red-700 text-xs px-2 py-1">
                          <Bug className="w-3 h-3 mr-1" />
                          Fixes
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Three placeholder lines...
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      23 Jan, 2024
                    </div>
                    <div className="text-sm text-gray-600">
                      Ecommerce UI Design
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      One placeholder line...
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose AI Humanizer Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose AI Humanizer?
          </h2>
        </div>

        {/* Feature Cards Grid - 3 top, 2 bottom centered */}
        <div className="max-w-6xl mx-auto">
          {/* Top Row - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Smart Rewriter */}
            <div className="text-center bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs">⏳</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Rewriter
              </h3>
              <p className="text-sm text-gray-600">
                Effortlessly rewrite generated text into natural, human-sounding
                content with our paraphraser. Perfect for improving readability.
              </p>
            </div>

            {/* SEO Optimized Article */}
            <div className="text-center bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs">☀</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                SEO Optimized Article
              </h3>
              <p className="text-sm text-gray-600">
                Generate high-quality, human-like articles that are SEO-friendly
                and ready to rank. Designed to meet search engine guidelines.
              </p>
            </div>

            {/* AI Detector */}
            <div className="text-center bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs">⚙</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Detector
              </h3>
              <p className="text-sm text-gray-600">
                Built in ai detector tool to ensure your content passes popular
                AI content checks. Stay safe from content filters and detection
                algorithms.
              </p>
            </div>
          </div>

          {/* Bottom Row - 2 Cards Centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              {/* Easy-to-use */}
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs">✱</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Easy-to-use
                </h3>
                <p className="text-sm text-gray-600">
                  No learning curve. Our user friendly interface helps you
                  humanize text in just a few clicks — ideal for marketers and
                  students
                </p>
              </div>

              {/* Flexible pricing */}
              <div className="text-center bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs">👥</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Flexible pricing
                </h3>
                <p className="text-sm text-gray-600">
                  Choose the plan that matches your content needs, from
                  occasional use to enterprise-level requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetAudience;
