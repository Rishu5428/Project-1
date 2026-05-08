import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ?
      'bg-white/95 backdrop-blur-md shadow-lg' :
      'bg-transparent'}`
      }>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1
              className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-forest-green' : 'text-white'}`
              }
              style={{ fontFamily: "'Playfair Display', serif" }}>


            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['home', 'about', 'menu', 'gallery', 'reviews', 'contact'].map((item) =>
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className={`text-sm font-medium uppercase tracking-wider transition-colors duration-300 hover:text-metallic-gold ${
              isScrolled ? 'text-coffee-brown' : 'text-white/90'}`
              }>

                {item}
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>

            {isMobileMenuOpen ?
            <X className={isScrolled ? 'text-forest-green' : 'text-white'} size={24} /> :

            <Menu className={isScrolled ? 'text-forest-green' : 'text-white'} size={24} />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen &&
      <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col space-y-4 p-6">
            {['home', 'about', 'menu', 'gallery', 'reviews', 'contact'].map((item) =>
          <button
            key={item}
            onClick={() => scrollToSection(item)}
            className="text-left text-coffee-brown hover:text-metallic-gold transition-colors uppercase tracking-wider font-medium">

                {item}
              </button>
          )}
          </nav>
        </div>
      }
    </header>);

};