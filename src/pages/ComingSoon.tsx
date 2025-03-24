import React, { useState } from 'react';
import { Clock, Mail, Instagram, Facebook, Twitter, CheckCircle } from 'lucide-react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Notification email:', email);
    setSubmitted(true);
    setEmail('');
    
    // Reset the submitted state after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-3xl w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-primary-600 rounded-full p-5 shadow-lg">
              <Clock className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Coming Soon
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're working hard to bring you an amazing toy rental experience. 
            Our website is under construction and will be launching soon!
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Get Notified When We Launch
            </h2>
            
            <p className="text-gray-600 mb-6">
              Be the first to know when we're ready. Sign up for our newsletter and 
              receive exclusive early access and special offers.
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Notify Me
                </button>
              </div>
              
              {submitted && (
                <div className="mt-3 text-green-600 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Thank you! We'll notify you when we launch.</span>
                </div>
              )}
            </form>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                What to Expect
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-2">Quality Toys</h4>
                  <p className="text-gray-600">
                    Carefully selected, high-quality toys that support child development
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-2">Flexible Rentals</h4>
                  <p className="text-gray-600">
                    Rent for as long as you need with easy extensions and returns
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-2">Sustainable Play</h4>
                  <p className="text-gray-600">
                    Reduce waste and save money while providing variety for your children
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Connect With Us
              </h3>
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  <Instagram className="h-8 w-8" />
                </a>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  <Facebook className="h-8 w-8" />
                </a>
                <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                  <Twitter className="h-8 w-8" />
                </a>
                <a href="mailto:info@homeofplay.com" className="text-gray-600 hover:text-primary-600 transition-colors">
                  <Mail className="h-8 w-8" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-primary-700 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-100">© 2025 The Home of Play. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
