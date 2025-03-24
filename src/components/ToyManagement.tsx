import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Edit, Trash2, Plus } from 'lucide-react';
import ToyForm from './ToyForm';
import { formatPrice } from '../lib/stripe';
import { useAuth } from '../contexts/AuthContext';
import DeleteToy from './DeleteToy';

interface Toy {
  id: string;
  name: string;
  description: string;
  price: number;
  rental_price: number;
  stock: number;
  rental_stock: number;
  image_url: string;
  category?: string;
  age_range?: string;
  rental_only: boolean;
  sale_only: boolean;
  created_at: string;
}

export default function ToyManagement() {
  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedToy, setSelectedToy] = useState<Toy | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toyToDelete, setToyToDelete] = useState<Toy | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchToys();
  }, []);

  const fetchToys = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('toys')
        .select('*')
        .order('name');
        
      if (error) throw error;
      setToys(data || []);
    } catch (err) {
      console.error('Error fetching toys:', err);
      setError('Failed to load toys. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (toy: Toy) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // First check for active rentals
      const { data: activeRentals, error: rentalError } = await supabase
        .from('rentals')
        .select('id')
        .eq('toy_id', toy.id)
        .eq('returned', false);

      if (rentalError) throw rentalError;
      if (activeRentals && activeRentals.length > 0) {
        throw new Error('Cannot delete toy with active rentals');
      }

      // Delete related records
      await supabase.from('wishlists').delete().eq('toy_id', toy.id);
      await supabase.from('cart_items').delete().eq('toy_id', toy.id);

      // Delete the toy
      const { error: deleteError } = await supabase
        .from('toys')
        .delete()
        .eq('id', toy.id);

      if (deleteError) throw deleteError;

      // Update local state
      setToys(toys.filter(t => t.id !== toy.id));
      setShowDeleteModal(false);
      setToyToDelete(null);
    } catch (err: any) {
      console.error('Error deleting toy:', err);
      setError(err.message || 'Failed to delete toy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Toy Management</h1>
        <button
          onClick={() => {
            setSelectedToy(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Plus className="inline-block mr-2" />
          Add New Toy
        </button>
      </div>

      {showForm && (
        <ToyForm
          toy={selectedToy}
          onClose={() => setShowForm(false)}
          onSave={() => {
            fetchToys();
            setShowForm(false);
          }}
        />
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showDeleteModal && toyToDelete && (
        <DeleteToy
          toyName={toyToDelete.name}
          onComplete={() => {
            setShowDeleteModal(false);
            fetchToys();
          }}
        />
      )}

      <div className="bg-white shadow rounded-lg p-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {toys.map((toy) => (
              <tr key={toy.id}>
                <td className="px-6 py-4 border-b border-gray-200">
                  {toy.name}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {formatPrice(toy.price)}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {toy.stock}
                </td>
                <td className="px-6 py-4 border-b border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedToy(toy);
                      setShowForm(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => {
                      setToyToDelete(toy);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
