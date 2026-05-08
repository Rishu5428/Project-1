import React, { useState } from 'react';
import { menuItems } from '../data/mock';
import { ChevronDown, ChevronRight } from 'lucide-react';

export const Menu = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState({});

  const toggleCategory = (index) => {
    if (expandedCategory === index) {
      setExpandedCategory(null);
      setExpandedSubcategory({});
    } else {
      setExpandedCategory(index);
      setExpandedSubcategory({});
    }
  };

  const toggleSubcategory = (categoryIndex, subIndex) => {
    const key = `${categoryIndex}-${subIndex}`;
    setExpandedSubcategory(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <section id="menu" className="py-24 bg-cream-bg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-metallic-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-forest-green/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2
            className="text-4xl md:text-5xl font-bold text-forest-green mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Menu
          </h2>
          <div className="h-1 w-24 bg-metallic-gold mx-auto mb-6 rounded-full animate-scale-in"></div>
          <p className="text-lg text-coffee-brown/80">
            Authentic flavors crafted with love and the finest ingredients
          </p>
        </div>

        {/* Menu Categories */}
        <div className="max-w-5xl mx-auto space-y-4">
          {menuItems.map((category, catIndex) => (
            <div
              key={category.id}
              className="bg-cream-bg rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 transition-all duration-500 hover:shadow-2xl hover:border-metallic-gold/40"
            >
              {/* Main Category Header */}
              <button
                onClick={() => toggleCategory(catIndex)}
                className="w-full px-6 md:px-8 py-6 md:py-7 flex items-center justify-between bg-gradient-to-r from-forest-green/10 via-metallic-gold/10 to-forest-green/10 hover:from-forest-green/15 hover:via-metallic-gold/15 hover:to-forest-green/15 transition-all duration-500 group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-forest-green group-hover:text-metallic-gold transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {category.category}
                </h3>
                <div className={`transform transition-transform duration-500 ${expandedCategory === catIndex ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-8 h-8 text-metallic-gold" />
                </div>
              </button>

              {/* Category Content */}
              <div
                className={`transition-all duration-700 ease-in-out ${
                  expandedCategory === catIndex 
                    ? 'max-h-[5000px] opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 md:p-8">
                  {/* If has subcategories (VEG/NON-VEG) */}
                  {category.subcategories ? (
                    <div className="space-y-4">
                      {category.subcategories.map((subcat, subIndex) => (
                        <div key={subIndex} className="border border-gray-200 rounded-xl overflow-hidden bg-white/50">
                          {/* Subcategory Header */}
                          <button
                            onClick={() => toggleSubcategory(catIndex, subIndex)}
                            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-cream-bg to-white hover:from-metallic-gold/10 hover:to-metallic-gold/5 transition-all duration-300"
                          >
                            <h4 className="text-xl font-bold text-coffee-brown">
                              {subcat.name}
                            </h4>
                            <ChevronRight className={`w-5 h-5 text-forest-green transform transition-transform duration-300 ${expandedSubcategory[`${catIndex}-${subIndex}`] ? 'rotate-90' : ''}`} />
                          </button>

                          {/* Subcategory Items */}
                          <div className={`transition-all duration-500 ${expandedSubcategory[`${catIndex}-${subIndex}`] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-6 py-4 space-y-3">
                              {subcat.items.map((item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0 hover:bg-gradient-to-r hover:from-metallic-gold/5 hover:to-transparent px-3 py-2 rounded-lg transition-all duration-300"
                                >
                                  <div className="flex-1">
                                    <h5 className="text-base md:text-lg font-semibold text-coffee-brown">
                                      {item.name}
                                    </h5>
                                    {item.description && (
                                      <p className="text-sm text-coffee-brown/70 mt-1">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                  {item.price && (
                                    <div className="ml-4 flex-shrink-0">
                                      <span className="text-lg md:text-xl font-bold text-metallic-gold">
                                        {item.price}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Direct items (Breads, Drinks, Desserts) */
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex justify-between items-start pb-3 border-b border-gray-200 last:border-0 hover:bg-gradient-to-r hover:from-metallic-gold/5 hover:to-transparent px-4 py-3 rounded-lg transition-all duration-300"
                        >
                          <div className="flex-1">
                            <h4 className="text-base md:text-lg font-semibold text-coffee-brown">
                              {item.name}
                            </h4>
                            {item.description && (
                              <p className="text-sm text-coffee-brown/70 mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          {item.price && (
                            <div className="ml-4 flex-shrink-0">
                              <span className="text-lg md:text-xl font-bold text-metallic-gold">
                                {item.price}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="text-center mt-12 animate-fade-in animation-delay-800">
          <p className="text-sm text-coffee-brown/60 italic">
            * Menu items and prices may vary. Please contact us for current availability.
          </p>
        </div>
      </div>
    </section>
  );
};
