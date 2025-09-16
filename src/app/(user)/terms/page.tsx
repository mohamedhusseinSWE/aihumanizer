"use client";

import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-gray-600 mb-8">Last updated on Feb 20, 2023</p>
          <p className="text-gray-600 mb-8">Effective from February 20, 2023</p>

          <div className="prose prose-lg max-w-none">
            <p className="mb-6">
              We at Aihumanizer.com (the &quot;Company&quot;, &quot;we&quot;, or
              &quot;us&quot;) are committed to safeguarding the privacy of our
              customers. This Privacy Policy entails the way in which your
              Personal Information or Usage Information will be collected, used,
              shared, stored, protected or disclosed by our service (including
              https://Aihumanizer.com ). This Privacy Policy applies to the
              mobile application or website developed by us in relation to
              services provided to you by the Company from time to time
              (&quot;Services&quot;). By using our Services, you agree to be
              bound by the terms of this Privacy Policy. If you do not accept
              the terms of the Privacy Policy, you are directed to discontinue
              accessing/using our application in any way. We strongly recommend
              that you read the policy carefully before proceeding with any
              transaction on our application.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Why we collect your information?
            </h2>
            <p className="mb-6">
              We collect information about you for the following general
              purposes: For registration and to manage your account, including
              to facilitate your access to and use of our Services; to
              communicate with you in general, including to provide information
              about us; to enable us to publish your reviews, forum posts, and
              other content; to respond to your questions and comments, to
              prevent potentially prohibited or illegal activities and to
              enforce our Terms of Use.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Collecting and Using Your Personal Data
            </h2>
            <p className="mb-4">
              When you visit or use our Services, we collect information about
              your computer or mobile device. Some of the information we collect
              include:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                Computer IP addresses, mobile device IDs (the unique identifier
                assigned to a device by a manufacturer), technical information
                about your computer or mobile device (such as type of device,
                web browser or operating system).
              </li>
              <li>
                Your mobile device&apos;s geographic location (specific
                geographic location if you&apos;ve enabled collection of that
                information, or general geographic location automatically)
              </li>
              <li>
                <strong>Cookies:</strong> If you are accessing our mobile
                application through computers we place &quot;Cookies&quot; on
                your computer to identify it. &quot;Cookies&quot; are
                identifiers we transfer to your computer or mobile device that
                allow us to recognize your browser or mobile device and tell us
                how and when pages and features in our Services are visited and
                by how many people. You may be able to change the preferences on
                your browser or mobile device to prevent or limit your computer
                or device&apos;s acceptance of cookies, but this may prevent you
                from taking advantage of some of our features. If you click on a
                link to a third party website, such third party may also
                transmit cookies to you. You hereby agree that this Privacy
                Policy does not cover the use of cookies by any third parties.
              </li>
            </ul>

            {/* Repeat the same pattern for all text content:
                - Replace " with &quot;
                - Replace ' with &apos;
            */}

            <p className="mb-6">
              If you have any questions about this Privacy Policy, You can
              contact us at support{" "}
              <a
                href="mailto:contact@Aihumanizer.com"
                className="text-blue-600 hover:underline"
              >
                contact@Aihumanizer.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
