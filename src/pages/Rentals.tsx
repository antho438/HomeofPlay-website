import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SearchFilters, { FilterOptions } from '../components/SearchFilters';
import ToyCard from '../components/ToyCard';

interface Toy {
  id: string;
  name: string;
  description: string;
  rental_price: number;
  rental_stock: number;
  image_url: string;
  category?: string;
  age_range?: string;
}

export default function Rentals() {
  const [toys, setToys] = useState<Toy[]>([]);
  const [filteredToys, setFilteredToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    priceRange: [0, 1000],
    ageRange: 'all',
    category: 'all',
    availability: true
  });

  useEffect(() => {
    async function fetchToys() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('toys')
          .select('*')
          .not('rental_stock', 'eq', 0)
          .not('rental_price', 'eq', 0)
          .order('name');

        if (error) {
          console.error('Error fetching toys:', error);
        } else {
          setToys(data || []);
          setFilteredToys(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchToys();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeFilters, toys]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  const applyFilters = () => {
    let result = [...toys];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        toy => 
          toy.name.toLowerCase().includes(query) || 
          toy.description.toLowerCase().includes(query)
      );
    }

    // Apply price filter
    result = result.filter(
      toy => 
        toy.rental_price >= activeFilters.priceRange[0] && 
        toy.rental_price <= activeFilters.priceRange[1]
    );

    // Apply category filter
    if (activeFilters.category !== 'all') {
      result = result.filter(
        toy => toy.category?.toLowerCase() === activeFilters.category.toLowerCase()
      );
    }

    // Apply age range filter
    if (activeFilters.ageRange !== 'all') {
      result = result.filter(
        toy => toy.age_range === activeFilters.ageRange
      );
    }

    // Apply availability filter
    if (activeFilters.availability) {
      result = result.filter(toy => toy.rental_stock > 0);
    }

    setFilteredToys(result);
  };

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
          Rent Our Toys
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:text-lg">
          Try before you buy or rent for special occasions.
        </p>
      </div>

      <SearchFilters 
        onSearch={handleSearch} 
        onFilter={handleFilter}
        showRentalOptions={true}
        showSaleOptions={false}
      />

      {filteredToys.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No toys match your criteria</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search query.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilters({
                priceRange: [0, 1000],
                ageRange: 'all',
                category: 'all',
                availability: true
              });
            }}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredToys.map((toy) => (
            <ToyCard
              key={toy.id}
              id={toy.id}
              name={toy.name}
              description={toy.description}
              rentalPrice={toy.rental_price}
              rentalStock={toy.rental_stock}
              imageUrl={toy.image_url}
              isRental={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
