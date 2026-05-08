import React, { useState, useEffect } from 'react';
import { Star, Upload, X, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    customer_type: 'Regular',
    rating: 5,
    review: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API}/reviews`, {
        name: formData.name,
        customer_type: formData.customer_type,
        rating: formData.rating,
        review: formData.review,
        image: formData.image
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        
        // Reset form
        setFormData({
          name: '',
          customer_type: 'Regular',
          rating: 5,
          review: '',
          image: null
        });
        setPreviewImage(null);
        setShowReviewForm(false);
        
        // Refresh reviews (won't show new one until approved)
        fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-metallic-gold fill-metallic-gold' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-24 bg-cream-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-forest-green mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Guest Experiences
          </h2>
          <div className="h-1 w-24 bg-metallic-gold mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-coffee-brown/80 mb-8">
            Hear from our valued guests about their memorable moments at Astha Bliss
          </p>
          
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-forest-green hover:bg-forest-green/90 text-white font-semibold px-8 py-6 rounded-full transition-all duration-300 hover:shadow-lg"
          >
            {showReviewForm ? 'View Reviews' : 'Share Your Experience'}
          </Button>
        </div>

        {/* Review Form */}
        {showReviewForm ? (
          <div className="max-w-3xl mx-auto mb-16 bg-cream-bg rounded-2xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-forest-green" style={{ fontFamily: "'Playfair Display', serif" }}>
                Share Your Experience
              </h3>
              <button
                onClick={() => setShowReviewForm(false)}
                className="text-coffee-brown/60 hover:text-coffee-brown transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-coffee-brown mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="customer_type" className="block text-sm font-medium text-coffee-brown mb-2">
                    Visit Type *
                  </label>
                  <select
                    id="customer_type"
                    name="customer_type"
                    value={formData.customer_type}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-coffee-brown focus:border-forest-green focus:ring-forest-green"
                  >
                    <option value="Couple">Couple</option>
                    <option value="Family">Family</option>
                    <option value="Regular">Regular Visitor</option>
                    <option value="Friends">Friends</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee-brown mb-3">
                  Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= formData.rating
                            ? 'text-metallic-gold fill-metallic-gold'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-coffee-brown font-medium">
                    {formData.rating} {formData.rating === 1 ? 'Star' : 'Stars'}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="review" className="block text-sm font-medium text-coffee-brown mb-2">
                  Your Review *
                </label>
                <Textarea
                  id="review"
                  name="review"
                  required
                  value={formData.review}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-none"
                  placeholder="Share your experience at Astha Bliss..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-coffee-brown mb-2">
                  Add a Photo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-forest-green transition-colors bg-gray-50 hover:bg-gray-100">
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setPreviewImage(null);
                            setFormData({ ...formData, image: null });
                          }}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100"
                        >
                          <X size={16} className="text-coffee-brown" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-coffee-brown/60 mx-auto mb-2" />
                        <p className="text-sm text-coffee-brown/60">Click to upload photo</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-forest-green hover:bg-forest-green/90 text-white font-semibold py-6 rounded-full transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </div>
        ) : (
          // Reviews Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Review Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span className="text-sm font-medium text-coffee-brown">{review.customer_type}</span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-coffee-brown">{review.name}</h4>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  <p className="text-coffee-brown/80 text-sm leading-relaxed mb-4 flex-1">
                    "{review.review}"
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-coffee-brown/60">
                      {new Date(review.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <div className="flex space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {!showReviewForm && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center bg-gradient-to-br from-forest-green/10 to-metallic-gold/10 rounded-2xl p-6">
              <div className="text-3xl font-bold text-forest-green mb-2">500+</div>
              <div className="text-sm text-coffee-brown/70">Happy Guests</div>
            </div>
            <div className="text-center bg-gradient-to-br from-forest-green/10 to-metallic-gold/10 rounded-2xl p-6">
              <div className="text-3xl font-bold text-forest-green mb-2 flex items-center justify-center">
                5.0 <Star className="w-6 h-6 text-metallic-gold fill-metallic-gold ml-1" />
              </div>
              <div className="text-sm text-coffee-brown/70">Average Rating</div>
            </div>
            <div className="text-center bg-gradient-to-br from-forest-green/10 to-metallic-gold/10 rounded-2xl p-6">
              <div className="text-3xl font-bold text-forest-green mb-2">100%</div>
              <div className="text-sm text-coffee-brown/70">Satisfaction</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
