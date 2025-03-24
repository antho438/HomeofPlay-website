import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCancel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-xl text-gray-500 mb-8">
          Your payment was not completed. Don't worry, no charges have been made.
        </p>
        
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">What went wrong?</h2>
          
          <div className="space-y-4 text-left">
            <p className="text-gray-600">
              There could be several reasons why your payment wasn't completed:
            </p>
            
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>You may have cancelled the payment yourself</li>
              <li>There might have been an issue with your payment method</li>
              <li>Your bank might have declined the transaction</li>
              <li>There could have been a temporary technical issue</li>
            </ul>
            
            <p className="text-gray-600">
              Your items are still in your cart, and you can try again whenever you're ready.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/cart"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Return to Cart
          </Link>
          
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
