"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is an AI humanizer?",
      answer:
        "An AI humanizer is a tool designed to transform AI-generated content into text that reads more naturally and human-like. It helps bypass AI detection tools while maintaining the original meaning and quality of the content.",
    },
    {
      question: "How does AI Text Humanizer work?",
      answer:
        "Our AI Text Humanizer uses advanced algorithms to analyze and rewrite AI-generated content. It restructures sentences, varies vocabulary, adjusts tone, and modifies writing patterns to make the text appear more human-written while preserving the original message and intent.",
    },
    {
      question: "Can this tool bypass AI detectors?",
      answer:
        "Yes, our humanizer is specifically designed to help content pass through various AI detection tools. However, we recommend always checking your content with multiple detectors to ensure effectiveness, as detection technologies continue to evolve.",
    },
    {
      question: "Is AIHumanizer free?",
      answer:
        "We offer both free and premium plans. The free version provides basic humanization features with limited usage, while our premium plans offer unlimited words, advanced models, and additional features like grammar checking and export options.",
    },
    {
      question: "How can I humanize text with this AI tool?",
      answer:
        "Simply paste your AI-generated text into our tool, select your preferences (like Enhanced Model if you're a premium user), and click &apos;Humanize Text&apos;. The tool will process your content and provide a more human-like version that you can copy, download, or export.",
    },
    {
      question: "How do you avoid plagiarism when rewriting other ideas?",
      answer:
        "Our tool focuses on rewriting and restructuring content rather than copying. It changes sentence structures, vocabulary, and phrasing while maintaining original ideas. However, we always recommend citing sources appropriately and ensuring your content meets academic or professional standards for originality.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Frequently asked questions
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Can&apos;t find any answer for your question?
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
