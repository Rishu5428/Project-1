import React, { useState, useEffect } from 'react';

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-forest-green via-coffee-brown to-forest-green flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-metallic-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Title */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Aastha Bliss Cafe
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-2xl md:text-3xl text-metallic-gold font-light tracking-wide mb-8 animate-fade-in-up animation-delay-400">
          A sip of Trust, A cup of Joy
        </p>

        {/* Loading Spinner */}
        <div className="flex justify-center items-center space-x-2 animate-fade-in animation-delay-800">
          <div className="w-3 h-3 bg-metallic-gold rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-metallic-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-metallic-gold rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};
