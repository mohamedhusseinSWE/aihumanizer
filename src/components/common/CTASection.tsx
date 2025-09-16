"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTASection = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Try our powerful AI humanizer
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Sign up is free trial to test our tool.
              <br />
              Get started right now!
            </p>

            <Link href="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Create Account
              </Button>
            </Link>

            <div className="flex items-center space-x-8 mt-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Easy installation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Free trial</span>
              </div>
            </div>
          </div>

          {/* Right side - Demo Document */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 ml-4">
                    Document.docx
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Credit Suisse Overview
                    </h3>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Humanize
                    </Button>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <p>
                      Credit Suisse, one of Switzerland&apos;s largest and most
                      prominent financial institutions, has a storied history
                      dating back to its founding in 1856.
                    </p>

                    <p>
                      Established by Alfred Escher in the heart of Switzerland,
                      the bank quickly grew to become a global player in
                      investment banking, private banking, and asset management
                      services.
                    </p>

                    <p className="bg-yellow-100 px-2 py-1 rounded">
                      Over the decades, Credit Suisse expanded its operations
                      internationally, gaining a reputation for serving
                      high-net-worth clients...
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">
                      AI Detection: Passed
                    </span>
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

export default CTASection;
