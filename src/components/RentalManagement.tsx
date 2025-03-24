import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Package, RefreshCw, Calendar, Clock, User, Check } from 'lucide-react';

const RentalManagement: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('rentals')
        .select(`
          id,
          status,
          created_at,
          start_date,
          end_date,
          returned,
          return_date,
          profiles!rentals_user_id_fkey(id, full_name, email),
          toys!rentals_toy_id_fkey(id, name, image_url)
        `)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setRentals(data || []);
    } catch (err) {
      console.error('Error fetching rentals:', err);
      setError(err.message);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRentals();
      const channel = supabase
        .channel('rentals')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rentals' }, fetchRentals)
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [isAdmin]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rental Management</h1>
        <Button onClick={fetchRentals} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          Loading rentals...
        </div>
      ) : rentals.length > 0 ? (
        <div className="grid gap-4">
          {rentals.map((rental) => (
            <div key={rental.id} className="p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Toy: {rental.toys?.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {rental.id}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Rented by: {rental.profiles?.full_name || rental.profiles?.email || 'Unknown'}
                  </h3>
                  <div className="flex gap-4 mt-2">
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(rental.start_date)} - {formatDate(rental.end_date)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {rental.returned ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    Status: {rental.status}
                  </h3>
                  <p className="text-sm">
                    {rental.returned ? (
                      <span className="text-green-600">
                        Returned on {formatDate(rental.return_date)}
                      </span>
                    ) : (
                      <span className="text-yellow-600">
                        Currently rented
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No rentals found in the database.
        </div>
      )}
    </div>
  );
};

export default RentalManagement;
