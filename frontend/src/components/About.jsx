import React from 'react';
import { Users, Sparkles, Coffee, Clock } from 'lucide-react';
import { features } from '../data/mock';

const iconMap = {
  Users: Users,
  Sparkles: Sparkles,
  Coffee: Coffee,
  Clock: Clock
};

export const About = () => {
  return (
    <section id="about" className="py-24 bg-cream-bg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-forest-green/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-metallic-gold/5 rounded-full blur-3xl" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2
            className="text-4xl md:text-5xl font-bold text-forest-green mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your Private Sanctuary
          </h2>
          <div className="h-1 w-24 bg-metallic-gold mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-coffee-brown/80 leading-relaxed">
            At Aastha Bliss, we believe that the best moments deserve the perfect setting. 
            Our thoughtfully designed private spaces offer you and your loved ones a haven 
            to connect, relax, and create beautiful memories.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={feature.id}
                className="group relative bg-cream-bg rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: 'fade-in-up 0.8s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-forest-green via-metallic-gold to-coffee-brown rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forest-green/10 to-metallic-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-forest-green" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-coffee-brown">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-coffee-brown/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-in-left animation-delay-200">
            <h3 className="text-3xl font-bold text-forest-green" style={{ fontFamily: "'Playfair Display', serif" }}>
              A Space Crafted for Connection
            </h3>
            <p className="text-coffee-brown/80 leading-relaxed">
              Whether you're celebrating a special occasion with your partner or spending 
              quality time with family, our private spaces are designed to make every moment special.
            </p>
            <p className="text-coffee-brown/80 leading-relaxed">
              From intimate corners for couples to spacious areas for families, each space 
              is thoughtfully curated with comfort and privacy in mind. Enjoy our authentic menu 
              while you unwind in your own personal sanctuary.
            </p>
            <div className="flex items-center space-x-4 pt-4 group">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-metallic-gold/20 to-forest-green/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Coffee className="w-7 h-7 text-forest-green" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-coffee-brown text-lg">Open Daily</p>
                <p className="text-sm text-coffee-brown/70">11:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="relative animate-slide-in-right animation-delay-400">
            <div className="absolute inset-0 bg-gradient-to-br from-forest-green/20 to-metallic-gold/20 rounded-3xl transform rotate-3 transition-transform duration-500 hover:rotate-6"></div>
            <div className="relative rounded-3xl shadow-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1521917441209-e886f0404a7b?w=800&h=600&fit=crop&q=80"
                alt="Cafe Interior"
                className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-green/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
