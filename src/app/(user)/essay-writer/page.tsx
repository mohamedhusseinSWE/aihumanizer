
"use client";


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { PenTool, Sparkles, FileText } from 'lucide-react';

export default function AIEssayWriter() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    // Simulate essay generation
    setTimeout(() => {
      setIsGenerating(false);
      // Here you would typically handle the actual essay generation
      console.log('Generating essay for:', topic);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <PenTool className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            AI Essay Writer
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Generate well-structured essays on any topic instantly
          </p>

          {/* Main Input Card */}
          <Card className="max-w-3xl mx-auto p-6 sm:p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="space-y-6">
              {/* Input Label */}
              <div className="text-left">
                <label htmlFor="essay-topic" className="text-base font-medium text-gray-700 mb-3 block">
                  What would you like your essay to be about?
                </label>
                
                {/* Textarea Input */}
                <Textarea
                  id="essay-topic"
                  placeholder="Enter your topic or context for the essay..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="min-h-[120px] sm:min-h-[140px] text-base resize-none border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                />
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleGenerate}
                  disabled={!topic.trim() || isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Essay
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
            <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">AI-Powered</h3>
                <p className="text-sm text-gray-600">
                  Advanced AI technology generates high-quality essays tailored to your topic
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Well-Structured</h3>
                <p className="text-sm text-gray-600">
                  Essays come with proper introduction, body paragraphs, and conclusion
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                  <PenTool className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Instant Results</h3>
                <p className="text-sm text-gray-600">
                  Get your complete essay in seconds, ready to use or customize
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}