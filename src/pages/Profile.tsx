import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { User, Package, Clock, Calendar, Edit, ShoppingBag, AlertCircle } from 'lucide-react';

interface Rental {
  id: string;
  toy_id: string;
  toy_name: string;
  start_date: string;
  end_date: string;
  returned: boolean;
  return_requested?: boolean;
  order_item_id?: string;
  image_url?: string;
  reason?: string;
  condition?: string;
}

interface ReturnFormData {
  orderItemId: string;
  reason: string;
  condition: string;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  toy_name: string;
  quantity: number;
  price: number;
  is_rental: boolean;
  image_url?: string;
}

interface ReturnRequestFormProps {
  orderItemId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ReturnRequestForm({ orderItemId, onClose, onSuccess }: ReturnRequestFormProps) {
  const [formData, setFormData] = useState<ReturnFormData>({
    orderItemId,
    reason: '',
    condition: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('return_requests')
        .insert([{
          order_item_id: formData.orderItemId,
          reason: formData.reason,
          condition: formData.condition,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'pending'
        }]);

      if (submitError) throw submitError;

      // Update order item status
      const { error: updateError } = await supabase
        .from('order_items')
        .update({ return_requested: true })
        .eq('id', formData.orderItemId);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Error submitting return request:', err);
      setError('Failed to submit return request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Return Request Form</h3>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success ? (
          <div className="text-center py-4">
            <p className="text-green-600 font-medium">Return request submitted successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for Return
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                required
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                Item Condition
              </label>
              <textarea
                id="condition"
                name="condition"
                rows={3}
                required
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeRentals, setActiveRentals] = useState<Rental[]>([]);
  const [pastRentals, setPastRentals] = useState<Rental[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchUserData();
  }, [user, navigate]);

  const createUserProfile = async () => {
    try {
      // First check if profile already exists to avoid duplicate key error
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user?.id)
        .maybeSingle();

      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert([{ 
            id: user?.id, 
            email: user?.email,
            full_name: '',
            phone: '',
            address: ''
          }])
          .select()
          .single();
          
        if (insertError) {
          // If error is not duplicate key, throw it
          if (insertError.code !== '23505') {
            throw insertError;
          }
          // Otherwise ignore - profile was created in a race condition
        }
      }

      // Fetch the profile again to ensure we have latest data
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (fetchError) throw fetchError;

      if (profile) {
        setProfile({
          fullName: profile.full_name || '',
          phone: profile.phone || '',
          address: profile.address || ''
        });
      }
    } catch (error) {
      console.error('Error creating/fetching user profile:', error);
      setProfileError('Failed to load profile data. Please try refreshing the page.');
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
        
      if (profileError) {
        // If no profile exists, create one
        if (profileError.code === 'PGRST116') {
          await createUserProfile();
        } else {
          console.error('Error fetching profile:', profileError);
          setProfileError('Failed to load profile data. Please try refreshing the page.');
        }
      } else if (profileData) {
        setProfile({
          fullName: profileData.full_name || '',
          phone: profileData.phone || '',
          address: profileData.address || ''
        });
      }
      
      // Fetch active rentals
      const { data: activeRentalsData, error: activeRentalsError } = await supabase
        .from('rentals')
        .select(`
          id,
          toy_id,
          start_date,
          end_date,
          returned,
          order_item_id,
          toys (
            name,
            image_url
          )
        `)
        .eq('user_id', user?.id)
        .eq('returned', false)
        .order('end_date', { ascending: true });
        
      if (activeRentalsError) {
        console.error('Error fetching active rentals:', activeRentalsError);
      } else {
        const formattedActiveRentals = (activeRentalsData || []).map(rental => ({
          id: rental.id,
          toy_id: rental.toy_id,
          toy_name: rental.toys?.name || 'Unknown Toy',
          start_date: rental.start_date,
          end_date: rental.end_date,
          returned: rental.returned,
          order_item_id: rental.order_item_id,
          image_url: rental.toys?.image_url
        }));
        setActiveRentals(formattedActiveRentals);
      }
      
      // Fetch past rentals
      const { data: pastRentalsData, error: pastRentalsError } = await supabase
        .from('rentals')
        .select(`
          id,
          toy_id,
          start_date,
          end_date,
          returned,
          order_item_id,
          toys (
            name,
            image_url
          )
        `)
        .eq('user_id', user?.id)
        .eq('returned', true)
        .order('end_date', { ascending: false });
        
      if (pastRentalsError) {
        console.error('Error fetching past rentals:', pastRentalsError);
      } else {
        const formattedPastRentals = (pastRentalsData || []).map(rental => ({
          id: rental.id,
          toy_id: rental.toy_id,
          toy_name: rental.toys?.name || 'Unknown Toy',
          start_date: rental.start_date,
          end_date: rental.end_date,
          returned: rental.returned,
          order_item_id: rental.order_item_id,
          image_url: rental.toys?.image_url
        }));
        setPastRentals(formattedPastRentals);
      }
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
      } else {
        // Fetch order items for each order
        const ordersWithItems = await Promise.all((ordersData || []).map(async (order) => {
          const { data: orderItemsData, error: orderItemsError } = await supabase
            .from('order_items')
            .select(`
              id,
              quantity,
              price,
              is_rental,
              toys (
                name,
                image_url
              )
            `)
            .eq('order_id', order.id);
            
          if (orderItemsError) {
            console.error('Error fetching order items:', orderItemsError);
            return {
              ...order,
              items: []
            };
          }
          
          const formattedItems = (orderItemsData || []).map(item => ({
            id: item.id,
            toy_name: item.toys?.name || 'Unknown Toy',
            quantity: item.quantity,
            price: item.price,
            is_rental: item.is_rental,
            image_url: item.toys?.image_url
          }));
          
          return {
            ...order,
            items: formattedItems
          };
        }));
        
        setOrders(ordersWithItems);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setProfileError('Failed to load user data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.fullName,
          phone: profile.phone,
          address: profile.address
        })
        .eq('id', user?.id);
        
      if (error) {
        throw error;
      }
      
      setIsEditing(false);
      setProfileError(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('Failed to update profile. Please try again.');
    }
  };

  const handleReturnRental = async (rentalId: string, toyId: string) => {
    if (!isAdmin) return;

    try {
      // Mark rental as returned
      const { error: updateError } = await supabase
        .from('rentals')
        .update({ returned: true })
        .eq('id', rentalId);
        
      if (updateError) {
        throw updateError;
      }
      
      // Update toy rental stock
      const { data: toyData, error: toyError } = await supabase
        .from('toys')
        .select('rental_stock')
        .eq('id', toyId)
        .single();
        
      if (toyError) {
        throw toyError;
      }
      
      const newRentalStock = (toyData?.rental_stock || 0) + 1;
      
      const { error: stockError } = await supabase
        .from('toys')
        .update({ rental_stock: newRentalStock })
        .eq('id', toyId);
        
      if (stockError) {
        throw stockError;
      }
      
      // Update UI
      const rental = activeRentals.find(r => r.id === rentalId);
      if (rental) {
        setActiveRentals(activeRentals.filter(r => r.id !== rentalId));
        setPastRentals([{ ...rental, returned: true }, ...pastRentals]);
      }
    } catch (error) {
      console.error('Error returning rental:', error);
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          My Profile
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:text-lg">
          Manage your account, rentals, and orders
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-2 rounded-full">
                  <User className="h-8 w-8 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-white">Account</h2>
              </div>
            </div>
            
            <div className="p-6">
              {profileError && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <p className="text-sm text-red-700">{profileError}</p>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={user.email}
                        disabled
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <textarea
                        id="address"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1 text-sm text-gray-900">{profile.fullName || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1 text-sm text-gray-900">{profile.phone || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="mt-1 text-sm text-gray-900">{profile.address || 'Not set'}</p>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Rentals */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-2 rounded-full">
                  <Package className="h-8 w-8 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-white">Active Rentals</h2>
              </div>
            </div>
            
            <div className="p-6">
              {activeRentals.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No active rentals</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Browse our collection and rent some toys
                  </p>
                  <button
                    onClick={() => navigate('/rentals')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Browse Rentals
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeRentals.map((rental) => {
                    const today = new Date();
                    const endDate = new Date(rental.end_date);
                    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    
                    let status = 'Active';
                    let color = 'bg-green-100 text-green-800';
                    
                    if (daysLeft < 0) {
                      status = 'Overdue';
                      color = 'bg-red-100 text-red-800';
                    } else if (daysLeft <= 3) {
                      status = `Due Soon (${daysLeft} days)`;
                      color = 'bg-yellow-100 text-yellow-800';
                    }
                    
                    return (
                      <div key={rental.id} className="flex flex-col sm:flex-row border border-gray-200 rounded-lg overflow-hidden">
                        <div className="w-full sm:w-1/4 bg-gray-100 flex items-center justify-center p-4">
                          {rental.image_url ? (
                            <img 
                              src={rental.image_url} 
                              alt={rental.toy_name} 
                              className="h-24 w-24 object-cover rounded-md"
                            />
                          ) : (
                            <Package className="h-16 w-16 text-gray-400" />
                          )}
                        </div>
                        <div className="w-full sm:w-3/4 p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900">{rental.toy_name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                              {status}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Start: {format(new Date(rental.start_date), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>End: {format(new Date(rental.end_date), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between">
                            {isAdmin && (
                              <button 
                                onClick={() => handleReturnRental(rental.id, rental.toy_id)}
                                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                              >
                                Mark as Returned
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrderItemId(rental.order_item_id || '')}
                              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                              disabled={!rental.order_item_id}
                            >
                              Request Return
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Rental History */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-2 rounded-full">
                  <Clock className="h-8 w-8 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-white">Rental History</h2>
              </div>
            </div>
            
            <div className="p-6">
              {pastRentals.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No rental history</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your past rentals will appear here
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toy
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rental Period
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pastRentals.map((rental) => (
                        <tr key={rental.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {rental.image_url ? (
                                  <img 
                                    src={rental.image_url} 
                                    alt={rental.toy_name} 
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {rental.toy_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                 ```tsx
                            <div className="text-sm text-gray-900">
                              {format(new Date(rental.start_date), 'MMM d, yyyy')} - {format(new Date(rental.end_date), 'MMM d, yyyy')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Returned
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-2 rounded-full">
                  <ShoppingBag className="h-8 w-8 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-white">Order History</h2>
              </div>
            </div>
            
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your purchase history will appear here
                  </p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Shop Now
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Order #{order.id.substring(0, 8)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(order.created_at), 'MMMM d, yyyy')}
                            </p>
                          </div>
                          <div>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {item.image_url ? (
                                  <img 
                                    src={item.image_url} 
                                    alt={item.toy_name} 
                                    className="h-10 w-10 rounded-md object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {item.toy_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {item.is_rental ? 'Rental' : 'Purchase'} × {item.quantity}
                                    </p>
                                  </div>
                                  <p className="text-sm font-medium text-gray-900">
                                    £{item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                          <p className="text-sm font-medium text-gray-500">Total</p>
                          <p className="text-sm font-bold text-gray-900">£{order.total_amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedOrderItemId && (
        <ReturnRequestForm
          orderItemId={selectedOrderItemId}
          onClose={() => setSelectedOrderItemId(null)}
          onSuccess={() => {
            setSelectedOrderItemId(null);
            fetchUserData();
          }}
        />
      )}
    </div>
  );
}
