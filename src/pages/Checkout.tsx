import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/stripe';
import { CreditCard, Truck, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Checkout() {
  const { cartItems, calculateSubtotal, calculateVAT, calculateTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      postal_code: '',
      country: 'GB', // UK country code
    }
  });

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    
    // Fetch user profile if available
    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          // Pre-fill form with user data if available
          setBillingDetails(prev => ({
            ...prev,
            name: data.full_name || '',
            email: user?.email || '',
            phone: data.phone || '',
            address: {
              ...prev.address,
              line1: data.address || '',
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [user, navigate, cartItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBillingDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    
    try {
      // Create a unique order ID for this transaction
      const orderTimestamp = Date.now();
      const paymentIntentId = `simulated_${orderTimestamp}`;
      
      // First, create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user?.id,
          total_amount: calculateTotal(),
          status: 'paid',
          billing_name: billingDetails.name,
          billing_email: billingDetails.email,
          billing_phone: billingDetails.phone,
          billing_address: `${billingDetails.address.line1}, ${billingDetails.address.line2}, ${billingDetails.address.city}, ${billingDetails.address.postal_code}`,
          payment_intent_id: paymentIntentId
        }])
        .select('id')
        .single();
        
      if (orderError) {
        throw orderError;
      }
      
      if (!orderData) {
        throw new Error('Failed to create order');
      }
      
      // Now create the order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        toy_id: item.toy_id,
        quantity: item.quantity,
        price: item.is_rental ? item.toy.rental_price : item.toy.price,
        is_rental: item.is_rental,
        rental_start_date: item.rental_start_date,
        rental_end_date: item.rental_end_date
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) {
        throw itemsError;
      }
      
      // Update inventory
      for (const item of cartItems) {
        const toyId = item.toy_id;
        const quantity = item.quantity;
        const isRental = item.is_rental;
        
        // Get current toy data
        const { data: toyData } = await supabase
          .from('toys')
          .select(isRental ? 'rental_stock' : 'stock')
          .eq('id', toyId)
          .single();
          
        if (toyData) {
          // Update stock
          const newStock = isRental 
            ? Math.max(0, toyData.rental_stock - quantity)
            : Math.max(0, toyData.stock - quantity);
            
          const updateData = isRental 
            ? { rental_stock: newStock }
            : { stock: newStock };
            
          await supabase
            .from('toys')
            .update(updateData)
            .eq('id', toyId);
        }
      }
      
      // If rental, create rental records
      const rentalItems = cartItems.filter(item => item.is_rental);
      if (rentalItems.length > 0) {
        const rentals = rentalItems.map(item => ({
          toy_id: item.toy_id,
          user_id: user?.id,
          start_date: item.rental_start_date,
          end_date: item.rental_end_date,
          returned: false
        }));
        
        await supabase
          .from('rentals')
          .insert(rentals);
      }
      
      // Clear the cart
      await clearCart();
      
      // Redirect to success page
      navigate('/payment/success');
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred with your payment. Please try again.');
      setLoading(false);
    }
  };

  if (!user || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Checkout
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:text-lg">
          Complete your purchase securely
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Billing Details</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={billingDetails.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={billingDetails.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={billingDetails.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address.line1" className="block text-sm font-medium text-gray-700">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="address.line1"
                      name="address.line1"
                      required
                      value={billingDetails.address.line1}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address.line2" className="block text-sm font-medium text-gray-700">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      id="address.line2"
                      name="address.line2"
                      value={billingDetails.address.line2}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        required
                        value={billingDetails.address.city}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address.postal_code" className="block text-sm font-medium text-gray-700">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="address.postal_code"
                        name="address.postal_code"
                        required
                        value={billingDetails.address.postal_code}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>Complete Order - {formatPrice(calculateTotal())}</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white shadow-md rounded-lg overflow-hidden sticky top-4">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <ul className="divide-y divide-gray-200 mb-6">
                {cartItems.map((item) => {
                  const isRental = item.is_rental;
                  const price = isRental ? item.toy.rental_price : item.toy.price;
                  let totalItemPrice = price * item.quantity;
                  
                  // Calculate rental period if it's a rental
                  if (isRental && item.rental_start_date && item.rental_end_date) {
                    const start = new Date(item.rental_start_date);
                    const end = new Date(item.rental_end_date);
                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
                    totalItemPrice = price * diffDays * item.quantity;
                  }
                  
                  return (
                    <li key={item.id} className="py-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                        {item.toy.image_url ? (
                          <img
                            src={item.toy.image_url} 
                            alt={item.toy.name} 
                            className="w-full h-full object-center object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.toy.name}</h3>
                            <p className="ml-4">{formatPrice(totalItemPrice)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {isRental ? 'Rental' : 'Purchase'} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              
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
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
                  <span>Secure checkout process</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <CreditCard className="h-5 w-5 text-green-500 mr-2" />
                  <span>We accept all major payment methods</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Truck className="h-5 w-5 text-green-500 mr-2" />
                  <span>Free delivery on orders over £50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
