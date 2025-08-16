import React, { useState } from 'react';
import { Upload, Wand2, Download, ArrowRight, FileText, CheckCircle } from 'lucide-react';

const sampleText = `Chapter 1: The Beginning

This is where our story starts. The protagonist walks through the door and discovers something amazing.

"Hello world," she said with excitement.

The room was filled with possibilities and wonder. Every corner held a new secret waiting to be discovered.

Chapter 2: The Journey

As the adventure continues, new challenges emerge. The path ahead is uncertain but filled with promise.`;

const formattedSample = `CHAPTER 1
THE BEGINNING

This is where our story starts. The protagonist walks through the door and discovers something amazing.

    "Hello world," she said with excitement.

The room was filled with possibilities and wonder. Every corner held a new secret waiting to be discovered.


CHAPTER 2
THE JOURNEY

As the adventure continues, new challenges emerge. The path ahead is uncertain but filled with promise.`;

export default function InteractiveDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);

  const handleDemo = () => {
    setIsProcessing(true);
    setCurrentStep(1);
    
    setTimeout(() => {
      setCurrentStep(2);
      setTimeout(() => {
        setIsProcessing(false);
        setShowResult(true);
        setCurrentStep(3);
      }, 1500);
    }, 2000);
  };

  const handleDownload = () => {
    setShowEmailCapture(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would capture the lead
      alert('Thanks! Check your email for the formatted sample and free trial link.');
      setShowEmailCapture(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Wand2 className="h-4 w-4 mr-2" />
            Try it free - No signup required
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See FormatFlex in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch your raw manuscript transform into professional formatting instantly
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Input Side */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                <span className="font-medium text-gray-700">Raw Manuscript</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                  {sampleText}
                </pre>
              </div>
              <div className="mt-4 text-center">
                {!isProcessing && !showResult && (
                  <button
                    onClick={handleDemo}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:scale-105 flex items-center mx-auto"
                  >
                    <Wand2 className="h-5 w-5 mr-2" />
                    Transform with AI
                  </button>
                )}
                {isProcessing && (
                  <div className="flex items-center justify-center text-blue-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                    <span className="font-medium">
                      {currentStep === 1 && "Analyzing structure..."}
                      {currentStep === 2 && "Applying formatting..."}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Output Side */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium text-gray-700">Professional Format</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto">
                {!showResult ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Formatted result will appear here</p>
                    </div>
                  </div>
                ) : (
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-serif leading-relaxed">
                    {formattedSample}
                  </pre>
                )}
              </div>
              <div className="mt-4 text-center">
                {showResult && !showEmailCapture && (
                  <button
                    onClick={handleDownload}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all hover:shadow-lg hover:scale-105 flex items-center mx-auto"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Full Sample
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Email Capture Modal */}
          {showEmailCapture && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Get Your Free Sample
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  Enter your email to download the formatted sample and start your free trial.
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEmailCapture(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Get Sample + Trial
                    </button>
                  </div>
                </form>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  No spam. Unsubscribe anytime. Start formatting professionally today.
                </p>
              </div>
            </div>
          )}

          {/* Features Highlight */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Advanced algorithms detect and format your content structure automatically.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry Standard</h3>
              <p className="text-gray-600">
                Professional formatting that meets publishing requirements across all platforms.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600">
                From upload to download in seconds. No waiting, no manual work required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}