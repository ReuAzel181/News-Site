import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, Newspaper, ArrowRight, Globe, Award, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white relative z-40">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Newspaper className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Veritas Bulletin</h3>
                  <p className="text-sm text-slate-400">Trusted News Source</p>
                </div>
              </div>
              <p className="text-base text-slate-300 leading-relaxed text-center md:text-left">
                Your trusted source for breaking news, in-depth analysis, and comprehensive coverage of events that shape our world.
              </p>
              <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="text-base text-slate-300">contact@veritas-bulletin.com</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span className="text-base text-slate-300">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="text-center md:text-left">
            <h4 className="text-base font-semibold mb-8">QUICK ACCESS</h4>
            <ul className="space-y-6">
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200 flex items-center justify-center md:justify-start group">
                  <Newspaper className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  Breaking News
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200 flex items-center justify-center md:justify-start group">
                  <Globe className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  Trending Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200 flex items-center justify-center md:justify-start group">
                  <Award className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  Live Updates
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200 flex items-center justify-center md:justify-start group">
                  <Users className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  News Archive
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="text-center md:text-left">
            <h4 className="text-base font-semibold mb-8">CATEGORIES</h4>
            <ul className="space-y-6">
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200 flex items-center justify-center md:justify-start group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  Politics
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200 flex items-center justify-center md:justify-start group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  Technology
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200 flex items-center justify-center md:justify-start group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  Sports
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200 flex items-center justify-center md:justify-start group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  Entertainment
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200 flex items-center justify-center md:justify-start group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  Business
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200 flex items-center justify-center md:justify-start group">
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                  World News
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-16 border-t border-slate-700">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6 text-center md:text-left">Be Among the First</h3>
                <p className="text-lg text-slate-300 mb-6 leading-relaxed text-center md:text-left">
                  Join our growing community and be among the first to receive breaking news, expert analysis, and comprehensive coverage delivered straight to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4 text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Real-time updates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">Ad-free content</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 p-8">
                <h4 className="text-xl font-semibold mb-6 text-center">Join Our Community</h4>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-slate-700 border-0 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                  <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 text-base">
                    Be the First to Know
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center">
                  No spam, unsubscribe at any time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center space-y-6 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 text-center md:text-left">
              <p className="text-xs text-slate-400">
                © 2024 Veritas Bulletin. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 justify-center">
                <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors duration-200 flex items-center group">
                  Privacy Policy
                  <ArrowRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                </a>
                <span className="text-xs text-slate-600">•</span>
                <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors duration-200 flex items-center group">
                  Terms of Service
                  <ArrowRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-6 justify-center md:justify-end">
              <span className="text-xs text-slate-400">Follow us:</span>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;