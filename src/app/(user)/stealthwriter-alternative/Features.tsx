"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";

const Features = () => {
  return (
    <div className="text-center mb-12 mt-12">
      <Badge
        variant="outline"
        className="mb-6 bg-slate-300 text-bold border-blue-200 rounded-full p-3"
      >
        <span className="text-2xl text-[#7a1ebd]"> ✨ FEATURES</span>
      </Badge>
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Humanize your AI content with ease
      </h2>
      <p className="text-xl text-gray-600">
        If you&apos;re creating content with AI, we make sure it
        <br />
        Discover why content creators prefer AIHumanizer over StealthWriter
      </p>
    </div>
  );
};

export default Features;
