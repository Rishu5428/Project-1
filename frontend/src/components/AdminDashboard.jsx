import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Star, Check, Trash2, Eye, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reviews');
  const [contacts, setContacts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    verifyAuth();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      await axios.get(`${API}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Auth verification failed:', error);
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('admin_token');
    
    try {
      const [contactsRes, reviewsRes] = await Promise.all([
        axios.get(`${API}/admin/contacts`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/admin/reviews`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setContacts(contactsRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const approveReview = async (reviewId) => {
    const token = localStorage.getItem('admin_token');
    try {
      await axios.put(`${API}/admin/reviews/${reviewId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Review approved!');
      fetchData();
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Failed to approve review');
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    const token = localStorage.getItem('admin_token');
    try {
      await axios.delete(`${API}/admin/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Review deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const markContactRead = async (contactId) => {
    const token = localStorage.getItem('admin_token');
    try {
      await axios.put(`${API}/admin/contacts/${contactId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error marking contact as read:', error);
    }
  };

  const deleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    
    const token = localStorage.getItem('admin_token');
    try {
      await axios.delete(`${API}/admin/contacts/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Contact deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? 'text-metallic-gold fill-metallic-gold' : 'text-gray-300'
        }`}
      />
    ));
  };

  const pendingReviews = reviews.filter(r => !r.approved);
  const approvedReviews = reviews.filter(r => r.approved);
  const unreadContacts = contacts.filter(c => !c.read);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-cream-bg shadow-sm border-b border-gray-200 animate-fade-in-up">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-forest-green" style={{ fontFamily: "'Playfair Display', serif" }}>
                Astha Bliss Cafe
              </h1>
              <p className="text-sm text-coffee-brown/70">Admin Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-coffee-brown/60 hover:text-forest-green transition-colors"
              >
                View Website
              </button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:text-white"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-cream-bg rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-coffee-brown/60">Pending Reviews</p>
                <p className="text-3xl font-bold text-forest-green">{pendingReviews.length}</p>
              </div>
              <Star className="w-10 h-10 text-metallic-gold/30" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-coffee-brown/60">Approved Reviews</p>
                <p className="text-3xl font-bold text-forest-green">{approvedReviews.length}</p>
              </div>
              <Check className="w-10 h-10 text-forest-green/30" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-coffee-brown/60">Unread Contacts</p>
                <p className="text-3xl font-bold text-forest-green">{unreadContacts.length}</p>
              </div>
              <Mail className="w-10 h-10 text-metallic-gold/30" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-coffee-brown/60">Total Contacts</p>
                <p className="text-3xl font-bold text-forest-green">{contacts.length}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-coffee-brown/30" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-cream-bg rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-forest-green text-forest-green'
                    : 'border-transparent text-coffee-brown/60 hover:text-coffee-brown'
                }`}
              >
                Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'contacts'
                    ? 'border-forest-green text-forest-green'
                    : 'border-transparent text-coffee-brown/60 hover:text-coffee-brown'
                }`}
              >
                Contacts ({contacts.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-coffee-brown/60">Loading...</p>
              </div>
            ) : activeTab === 'reviews' ? (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-center text-coffee-brown/60 py-8">No reviews yet</p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className={`border rounded-lg p-4 ${
                        review.approved ? 'border-green-200 bg-green-50/30' : 'border-orange-200 bg-orange-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {review.image && (
                              <img
                                src={review.image}
                                alt={review.name}
                                className="w-12 h-12 rounded-full object-cover cursor-pointer"
                                onClick={() => setSelectedImage(review.image)}
                              />
                            )}
                            <div>
                              <h4 className="font-semibold text-coffee-brown">{review.name}</h4>
                              <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-xs text-coffee-brown/60">{review.customer_type}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-coffee-brown/80 mb-2">"{review.review}"</p>
                          <p className="text-xs text-coffee-brown/50">
                            {new Date(review.created_at).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {review.approved ? (
                            <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                              <Check size={14} className="mr-1" /> Approved
                            </span>
                          ) : (
                            <Button
                              onClick={() => approveReview(review.id)}
                              size="sm"
                              className="bg-forest-green hover:bg-forest-green/90 text-white"
                            >
                              <Check size={14} className="mr-1" /> Approve
                            </Button>
                          )}
                          <Button
                            onClick={() => deleteReview(review.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <p className="text-center text-coffee-brown/60 py-8">No contacts yet</p>
                ) : (
                  contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`border rounded-lg p-4 ${
                        contact.read ? 'border-gray-200 bg-gray-50/30' : 'border-blue-200 bg-blue-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-coffee-brown">{contact.name}</h4>
                            {!contact.read && (
                              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-coffee-brown/70 mb-1">
                            <strong>Email:</strong> {contact.email}
                          </p>
                          {contact.phone && (
                            <p className="text-sm text-coffee-brown/70 mb-1">
                              <strong>Phone:</strong> {contact.phone}
                            </p>
                          )}
                          <p className="text-sm text-coffee-brown/80 mb-2">
                            <strong>Message:</strong> {contact.message}
                          </p>
                          <p className="text-xs text-coffee-brown/50">
                            {new Date(contact.created_at).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!contact.read && (
                            <Button
                              onClick={() => markContactRead(contact.id)}
                              size="sm"
                              variant="outline"
                              className="border-forest-green text-forest-green hover:bg-forest-green hover:text-white"
                            >
                              <Eye size={14} className="mr-1" /> Mark Read
                            </Button>
                          )}
                          <Button
                            onClick={() => deleteContact(contact.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Review"
            className="max-w-full max-h-[90vh] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
