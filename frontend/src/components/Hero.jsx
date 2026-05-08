import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { cafeInfo } from '../data/mock';

export const Hero = () => {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=1920&h=1080&fit=crop&q=75"
          alt="Astha Bliss Cafe"
          className="w-full h-full object-cover animate-scale-in"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest-green/80 via-coffee-brown/70 to-forest-green/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="space-y-8">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fade-in-up"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {cafeInfo.name}
          </h1>
          
          <div className="h-1 w-32 bg-metallic-gold mx-auto rounded-full animate-scale-in animation-delay-200"></div>
          
          <p className="text-2xl sm:text-3xl text-metallic-gold font-light tracking-wide animate-fade-in-up animation-delay-400">
            {cafeInfo.tagline}
          </p>
          
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-600">
            {cafeInfo.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 animate-fade-in-up animation-delay-800">
            <Button
              onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-metallic-gold hover:bg-metallic-gold/90 text-coffee-brown font-semibold px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Explore Menu
            </Button>
            <Button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-forest-green font-semibold px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
            >
              Visit Us
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-float animation-delay-1000"
      >
        <ChevronDown className="text-white w-10 h-10" />
      </button>
    </section>
  );
};
