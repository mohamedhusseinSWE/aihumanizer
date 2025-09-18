"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User, UserCheck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BypassAISection2 = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image with overlaid testimonials */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/images/saas-img-2.jpg"
                alt="Professional woman working with laptop"
                width={500}
                height={400}
                className="w-full h-auto rounded-2xl"
              />

              {/* Overlaid testimonial cards */}
              <div className="absolute left-4 top-1/4 space-y-3">
                {/* Profile 1 */}
                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>

                {/* Profile 2 */}
                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>

                {/* Profile 3 */}
                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div>
            <Badge
              variant="outline"
              className="mb-4 text-purple-600 border-purple-200 text-sm font-medium"
            >
              Better Content
            </Badge>

            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Enhanced Content Quality
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Unlike Rephrasy, which often reduces content quality, AIHumanizer
              maintains or improves readability and engagement.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">
                  Natural-sounding output that engages readers
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">
                  Preservation of technical accuracy and key terminology
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">
                  Option to enhance clarity and readability during processing
                </span>
              </div>
            </div>

            <Link href="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BypassAISection2;
