import React, { useState } from 'react';
import { Heart, Calendar, Plus, Minus, LogIn } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/stripe';

interface ToyCardProps {
  id: string;
  name: string;
  description: string;
  price?: number;
  rentalPrice?: number;
  stock?: number;
  rentalStock?: number;
  imageUrl?: string;
  isRental?: boolean;
  isSale?: boolean;
}

export default function ToyCard({
  id,
  name,
  description,
  price,
  rentalPrice,
  stock,
  rentalStock,
  imageUrl,
  isRental = false,
  isSale = false
}: ToyCardProps) {
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(id);
  const [quantity, setQuantity] = useState(1);
  const [showRentalDates, setShowRentalDates] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login if not logged in
      window.location.href = '/login';
      return;
    }
    
    if (inWishlist) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(id);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, isRentalPurchase: boolean) => {
    e.preventDefault();
    
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    if (isRentalPurchase) {
      if (!showRentalDates) {
        setShowRentalDates(true);
        return;
      }
      
      await addToCart(id, quantity, true, startDate, endDate);
      setShowRentalDates(false);
    } else {
      await addToCart(id, quantity, false);
    }
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const renderAuthButton = (isRentalType: boolean) => {
    if (!user) {
      return (
        <Link
          to="/login"
          className="flex-1 px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
        >
          <LogIn className="h-4 w-4" />
          <span>Sign In to {isRentalType ? 'Rent' : 'Buy'}</span>
        </Link>
      );
    }

    if (isRentalType) {
      return (
        <button
          disabled={(rentalStock !== undefined && rentalStock <= 0)}
          onClick={(e) => handleAddToCart(e, true)}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            rentalStock === undefined || rentalStock > 0
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {showRentalDates ? 'Add to Cart' : 'Rent Now'}
        </button>
      );
    }

    return (
      <button
        disabled={stock !== undefined && stock <= 0}
        onClick={(e) => handleAddToCart(e, false)}
        className={`flex-1 px-4 py-2 rounded-md transition-colors ${
          stock === undefined || stock > 0
            ? 'bg-secondary-600 text-white hover:bg-secondary-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Add to Cart
      </button>
    );
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      {imageUrl ? (
        <div className="w-full h-60 bg-gray-200 aspect-w-1 aspect-h-1 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity"
          />
        </div>
      ) : (
        <div className="w-full h-60 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      )}
      
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-2 right-2 p-2 rounded-full ${
          inWishlist 
            ? 'bg-red-100 text-red-600' 
            : 'bg-white/80 text-gray-400 hover:text-red-600'
        } transition-colors`}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
      </button>
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-500">{truncateDescription(description)}</p>
        
        <div className="mt-3 flex items-center justify-between">
          {isRental && rentalPrice !== undefined && (
            <p className="text-lg font-medium text-gray-900">
              {formatPrice(rentalPrice)}/day
            </p>
          )}
          
          {isSale && price !== undefined && (
            <p className="text-lg font-medium text-gray-900">
              {formatPrice(price)}
            </p>
          )}
          
          <span className="text-sm text-gray-500">
            {isRental && rentalStock !== undefined && `${rentalStock} available`}
            {isSale && stock !== undefined && `${stock} available`}
          </span>
        </div>
        
        {showRentalDates && isRental && (
          <div className="mt-4 space-y-3 bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Rental Period
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button 
              onClick={decrementQuantity}
              className="px-2 py-1 text-gray-500 hover:text-gray-700"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-2 py-1 text-gray-700">{quantity}</span>
            <button 
              onClick={incrementQuantity}
              className="px-2 py-1 text-gray-500 hover:text-gray-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          {isRental && renderAuthButton(true)}
          {isSale && renderAuthButton(false)}
        </div>
      </div>
    </div>
  );
}
