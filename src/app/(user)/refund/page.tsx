"use client";

import React from "react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Refund Policy
          </h1>
          <p className="text-gray-600 mb-8">Last updated on Jan 14, 2025</p>
          <p className="text-gray-600 mb-8">Effective from February 20, 2023</p>

          <div className="prose prose-lg max-w-none">
            <p className="mb-6">
              We at Aihumanizer.com (the &quot;Company&quot;, &quot;we&quot;, or
              &quot;us&quot;) are dedicated to providing you with the most
              advanced AI models to make your content more natural and engaging.
              That said, we acknowledge that no technology can guarantee 100%
              accuracy at all times.
            </p>

            <p className="mb-6">
              If you are not satisfied with our service, you may request a
              refund within 30 days of the payment date. Once your request is
              received, we will process the refund immediately, with no
              questions asked. Please note that it may take 2 to 7 business days
              for the refunded amount to reflect in your bank account, depending
              on your financial institution.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Contact us for refund
            </h2>
            <p className="mb-6">
              To request a refund, please email us at{" "}
              <a
                href="mailto:contact@Aihumanizer.com"
                className="text-blue-600 hover:underline"
              >
                contact@Aihumanizer.com
              </a>
            </p>

            <p className="mb-6">
              If you have a PayPal account, please include your PayPal address
              in your refund request email to receive an instant refund on the
              same day.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Important Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Refunds are processed within 30 days of payment date
                      </li>
                      <li>No questions asked policy for refund requests</li>
                      <li>
                        Processing time: 2-7 business days for bank transfers
                      </li>
                      <li>Same-day refunds available for PayPal accounts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Refund Process
              </h3>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>
                  Send an email to{" "}
                  <a
                    href="mailto:contact@Aihumanizer.com"
                    className="text-blue-600 hover:underline"
                  >
                    contact@Aihumanizer.com
                  </a>{" "}
                  with your refund request
                </li>
                <li>
                  Include your account email and PayPal address (if applicable)
                </li>
                <li>We will process your refund immediately upon receipt</li>
                <li>You will receive confirmation of the refund processing</li>
                <li>
                  Funds will appear in your account within 2-7 business days
                </li>
              </ol>
            </div>

            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Customer Satisfaction Guarantee
              </h3>
              <p className="text-green-700">
                We stand behind our AI humanization service and want you to be
                completely satisfied. If for any reason you&apos;re not happy
                with the results, we&apos;ll make it right with a full refund,
                no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
