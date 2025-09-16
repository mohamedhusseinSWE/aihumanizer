import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          {/* Copyright */}
          <div className="text-gray-500 text-sm">
            Copyright © 2025{" "}
            <span className="text-purple-500">AI Humanizer</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              href="/privacy"
              className="text-purple-500 text-sm hover:text-purple-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-purple-500 text-sm hover:text-purple-600 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/refund"
              className="text-purple-500 text-sm hover:text-purple-600 transition-colors"
            >
              Refund
            </Link>

            <Link
              href="/affiliate"
              className="text-purple-500 text-sm hover:text-purple-600 transition-colors"
            >
              Affiliate Program
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
