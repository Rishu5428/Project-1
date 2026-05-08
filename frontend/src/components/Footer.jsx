import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-forest-green via-coffee-brown to-forest-green text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Aastha Bliss Cafe
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Your private sanctuary for creating beautiful memories with loved ones.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-metallic-gold">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              {['Home', 'About', 'Menu', 'Gallery', 'Reviews', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-white/80 hover:text-metallic-gold transition-colors text-sm text-left"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-metallic-gold">Opening Hours</h4>
            <div className="text-white/80 text-sm space-y-2">
              <p className="font-medium">Open Daily</p>
              <p>11:00 AM - 11:00 PM</p>
              <p className="text-xs mt-4 text-white/60">
                Private spaces available for reservation
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/70 text-sm flex items-center justify-center gap-2">
            © {currentYear} Astha Bliss Cafe. Made with <Heart className="w-4 h-4 text-metallic-gold" fill="currentColor" /> for creating memories
          </p>
        </div>
      </div>
    </footer>
  );
};
