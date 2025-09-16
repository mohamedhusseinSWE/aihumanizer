"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const DetectionMeter = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text and Button */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Make your text undetectable
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Humanize your AI texts with our smart AI humanizer to bypass all
                AI detectors.
              </p>
              <Link href="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Create Account
                </Button>
              </Link>
            </div>

            {/* Right side - Gauge Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <Image
                  src="/images/gauge.png"
                  alt="AI Detection Gauge"
                  width={400}
                  height={300}
                  className="w-full max-w-md h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionMeter;
