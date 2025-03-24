import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Trash2, Plus, Minus, Calendar } from 'lucide-react';
import { formatPrice } from '../lib/stripe';

export default function Cart() {
  const { cartItems, loading, removeFromCart, updateQuantity, calculateSubtotal, calculateVAT, calculateTotal, calculateRentalDays } = useCart();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Your Shopping Cart
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:text-lg">
          Review your items before checkout
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Browse our collection of toys and add your favorites to your cart.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              to="/rentals"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Rentals
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const isRental = item.is_rental;
                  const price = isRental ? item.toy.rental_price : item.toy.price;
                  let totalItemPrice = price * item.quantity;
                  
                  // Calculate rental period if it's a rental
                  let rentalDays = 0;
                  if (isRental && item.rental_start_date && item.rental_end_date) {
                    rentalDays = calculateRentalDays(item.rental_start_date, item.rental_end_date);
                    totalItemPrice = price * rentalDays * item.quantity;
                  }
                  
                  return (
                    <li key={item.id} className="p-6">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-md mb-4 sm:mb-0">
                          {item.toy.image_url ? (
                            <img
                              src={item.toy.image_url}
                              alt={item.toy.name}
                              className="w-full h-full object-center object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="sm:ml-6 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{item.toy.name}</h3>
                              <p className="mt-1 text-sm text-gray-500">{item.toy.description.substring(0, 100)}...</p>
                              
                              {isRental && item.rental_start_date && item.rental_end_date && (
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>
                                    {new Date(item.rental_start_date).toLocaleDateString()} to {new Date(item.rental_end_date).toLocaleDateString()} 
                                    ({rentalDays} {rentalDays === 1 ? 'day' : 'days'})
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-lg font-medium text-gray-900">
                              {isRental 
                                ? `${formatPrice(price)}/day` 
                                : formatPrice(price)}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="px-2 py-1 text-gray-500 hover:text-gray-700"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-1 text-gray-700">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-gray-500 hover:text-gray-700"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="flex items-center">
                              <p className="text-lg font-medium text-gray-900 mr-4">
                                {formatPrice(totalItemPrice)}
                              </p>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden sticky top-4">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="text-gray-900 font-medium">{formatPrice(calculateSubtotal())}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">VAT (20%)</p>
                    <p className="text-gray-900 font-medium">{formatPrice(calculateVAT())}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <p className="text-lg font-medium text-gray-900">Total</p>
                    <p className="text-lg font-bold text-gray-900">{formatPrice(calculateTotal())}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link
                    to="/checkout"
                    className="w-full bg-primary-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
                
                <div className="mt-4">
                  <Link
                    to="/shop"
                    className="w-full text-center block text-sm text-primary-600 hover:text-primary-800"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
