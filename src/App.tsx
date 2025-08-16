import React from 'react';
import { 
  BookOpen, 
  Zap, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Upload,
  Settings,
  Download,
  Star,
  Users,
  TrendingUp,
  Palette,
  FileText,
  Share2,
  Globe
} from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FormatFlex
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#roadmap" className="text-gray-600 hover:text-blue-600 transition-colors">Roadmap</a>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:scale-105">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="h-4 w-4 mr-2" />
              Transform manuscripts in seconds
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Professional Book
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent block">
                Formatting Made Simple
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload your manuscript and receive a professionally formatted file instantly. 
              No more hours spent on formatting - our AI handles everything automatically.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all hover:shadow-xl hover:scale-105 flex items-center">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <div className="text-gray-500 text-sm">
                $10/month • Cancel anytime
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">$192B</div>
                <div className="text-gray-600">Self-publishing market</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">Instant</div>
                <div className="text-gray-600">Professional formatting</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">Zero</div>
                <div className="text-gray-600">Formatting hassle</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Upload Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From raw manuscript to formatted file instantly
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Manuscript</h3>
              <p className="text-gray-600">
                Upload your manuscript in any common format. Our AI instantly analyzes and processes your content.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Receive Formatted File</h3>
              <p className="text-gray-600">
                Download your professionally formatted manuscript, ready for publishing across all platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need, Automated
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional book formatting that would take hours is now done in seconds
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Chapter Formatting</h3>
                  <p className="text-gray-600">
                    Automatically detects and formats chapter breaks, headings, and section divisions with perfect consistency.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Table of Contents Generation</h3>
                  <p className="text-gray-600">
                    Creates professional table of contents with proper page numbers and hierarchical structure.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfect Margins & Typography</h3>
                  <p className="text-gray-600">
                    Industry-standard margins, spacing, and typography that meets professional publishing requirements.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Format Export</h3>
                  <p className="text-gray-600">
                    Generates print-ready PDFs and perfectly formatted ebooks for Kindle, Apple Books, and more.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BookOpen className="h-24 w-24 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Live formatting preview would appear here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Monthly Subscription
            </h2>
            <p className="text-xl text-gray-600">
              Professional formatting without the hassle
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-blue-200 relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly Subscription</h3>
                <div className="text-5xl font-bold text-blue-600 mb-2">$10</div>
                <p className="text-gray-600">per month</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Unlimited manuscript formatting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Instant AI-powered processing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Professional formatting templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">Cancel anytime</span>
                </li>
              </ul>
              
              <button className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all hover:shadow-lg">
                Start Free Trial
              </button>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600">
              💡 <strong>No setup fees, no contracts.</strong> Start formatting professionally today.
            </p>
          </div>
        </div>
      </section>

      {/* Future Roadmap */}
      <section id="roadmap" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Complete Publishing Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              FormatFlex is expanding beyond formatting to cover your entire book production workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Cover Generation</h3>
              <p className="text-gray-600 text-sm">AI-powered cover designs that match your genre and content perfectly.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Blurb Optimization</h3>
              <p className="text-gray-600 text-sm">Compelling book descriptions optimized for discovery and conversion.</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center">
              <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Metadata Suggestions</h3>
              <p className="text-gray-600 text-sm">Smart categories, keywords, and pricing recommendations for maximum visibility.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Distribution Prep</h3>
              <p className="text-gray-600 text-sm">One-click formatting for Amazon KDP, IngramSpark, Apple Books, and more.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-gray-100 text-gray-700 px-6 py-3 rounded-full">
              <TrendingUp className="h-5 w-5 mr-2" />
              Coming Soon - Join the waitlist for early access
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for Instant Professional Formatting?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join authors who've eliminated formatting hassle and focus on what matters - their writing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all hover:shadow-xl hover:scale-105">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
              See Example
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="font-bold text-2xl">FormatFlex</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Professional book formatting in seconds. Transform your manuscript into a publication-ready book with our AI-powered platform.
              </p>
              <div className="flex space-x-4">
                <div className="text-gray-300">
                  <Star className="h-5 w-5 inline mr-1" />
                  Trusted by 10,000+ authors
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#roadmap" className="hover:text-blue-400 transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Templates</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FormatFlex. All rights reserved. Transforming manuscripts into professional books.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;