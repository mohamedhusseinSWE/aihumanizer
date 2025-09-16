"use client";

import React from "react";
import { Badge } from "../ui/badge";
import Image from "next/image";

const ResultDemo = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* AIHumanizer Interface Demo */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="w-full">
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-200">
                <Image
                  src="/images/hero.png"
                  alt="AIHumanizer Interface Demo"
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-lg"
                  priority
                />
              </div>
            </div>

            <div className="text-center mb-12 mt-12">
              <Badge
                variant="outline"
                className="mb-6 bg-slate-300 text-bold border-blue-200 rounded-full p-3"
              >
                <span className="text-2xl text-[#7a1ebd]"> ✨ FEATURES</span>
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Humanize AI text in seconds
              </h2>
              <p className="text-xl text-gray-600">
                If you&apos;re creating content with AI, we make sure it
                <br />
                sounds human — and stays undetectable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDemo;
