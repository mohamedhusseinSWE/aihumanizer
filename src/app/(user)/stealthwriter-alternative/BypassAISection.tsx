"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, GraduationCap, BookOpen, PenTool } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BypassAISection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <Badge
              variant="outline"
              className="mb-4 text-purple-600 border-purple-200 text-sm font-medium"
            >
              Ultra AI Model
            </Badge>

            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Advanced Pattern Transformation
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              AIHumanizer uses proprietary pattern transformation technology
              that outperforms StealthWriter&apos;s basic humanization approach.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">
                  Deep structural variations that maintain original meaning
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">
                  Statistical pattern randomization that defeats AI detectors
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">
                  Linguistic fingerprint alteration that preserves readability
                </span>
              </div>
            </div>

            <Link href="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Create Account
              </Button>
            </Link>
          </div>

          {/* Right side - Image with overlaid testimonials */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/images/saas-img-1.jpg"
                alt="Professional working with laptop"
                width={500}
                height={400}
                className="w-full h-auto rounded-2xl"
              />

              {/* Overlaid testimonial cards */}
              <div className="absolute bottom-4 left-4 space-y-3">
                {/* Student Card */}
                <div className="bg-white rounded-lg p-3 shadow-lg flex items-center space-x-3 w-48">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex-shrink-0 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">
                      Jitu Doe
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 text-xs px-2 py-1">
                      Student
                    </Badge>
                  </div>
                </div>

                {/* Researcher Card */}
                <div className="bg-white rounded-lg p-3 shadow-lg flex items-center space-x-3 w-48">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">
                      Anita Par
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
                      Researcher
                    </Badge>
                  </div>
                </div>

                {/* Writer Card */}
                <div className="bg-white rounded-lg p-3 shadow-lg flex items-center space-x-3 w-48">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center">
                    <PenTool className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">
                      Sandip
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1">
                      Writer
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BypassAISection;
