import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { cafeInfo } from '../data/mock';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API}/contact`, formData);
      if (response.data.success) {
        setIsSuccess(true);
        toast.success(response.data.message);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-cream-bg relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-20 right-20 w-64 h-64 bg-metallic-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-forest-green/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2
            className="text-4xl md:text-5xl font-bold text-forest-green mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Visit Us
          </h2>
          <div className="h-1 w-24 bg-metallic-gold mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-coffee-brown/80">
            We'd love to welcome you to Aastha Bliss. Get in touch or drop by!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8 animate-slide-in-left animation-delay-200">
            <div className="bg-cream-bg rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:border-metallic-gold/30">>
              <h3 className="text-2xl font-bold text-forest-green mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Get in Touch
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-full bg-forest-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-metallic-gold/20 transition-colors">
                    <MapPin className="w-6 h-6 text-forest-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-coffee-brown mb-1">Location</h4>
                    <p className="text-coffee-brown/70 text-sm">{cafeInfo.location.coordinates}</p>
                    <p className="text-coffee-brown/70 text-sm">{cafeInfo.location.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-full bg-forest-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-metallic-gold/20 transition-colors">
                    <Clock className="w-6 h-6 text-forest-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-coffee-brown mb-1">Hours</h4>
                    <p className="text-coffee-brown/70 text-sm">Open Daily</p>
                    <p className="text-coffee-brown/70 text-sm">{cafeInfo.hours}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 rounded-full bg-forest-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-metallic-gold/20 transition-colors">
                    <Phone className="w-6 h-6 text-forest-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-coffee-brown mb-1">Phone</h4>
                    <p className="text-coffee-brown/70 text-sm">{cafeInfo.contact.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-br from-forest-green/10 to-metallic-gold/10 rounded-2xl p-8">
              <h4 className="text-xl font-bold text-forest-green mb-4">Visit Us Today!</h4>
              <p className="text-coffee-brown/80 text-sm leading-relaxed">
                Experience authentic flavors in a cozy atmosphere. Perfect for family gatherings, 
                couple dates, and casual dining. Walk-ins welcome!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-cream-bg rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 animate-slide-in-right animation-delay-400">
            <h3 className="text-2xl font-bold text-forest-green mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Send us a Message
            </h3>
            
            {isSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                <p className="text-green-700 text-center font-medium">✓ Message sent successfully!</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-coffee-brown mb-2">
                  Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-gray-300 focus:border-forest-green focus:ring-forest-green"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-coffee-brown mb-2">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-gray-300 focus:border-forest-green focus:ring-forest-green"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-coffee-brown mb-2">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-gray-300 focus:border-forest-green focus:ring-forest-green"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-coffee-brown mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border-gray-300 focus:border-forest-green focus:ring-forest-green resize-none"
                  placeholder="Tell us about your visit or reservation..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-forest-green hover:bg-forest-green/90 text-white font-semibold py-6 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
