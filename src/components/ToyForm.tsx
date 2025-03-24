import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Save, AlertCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface ToyFormProps {
  toy?: Toy;
  onClose: () => void;
  onSave: () => void;
  isEdit?: boolean;
}

interface Toy {
  id?: string;
  name: string;
  description: string;
  price: number;
  rental_price: number;
  stock: number;
  rental_stock: number;
  image_url: string;
  category: string;
  age_range: string;
  rental_only: boolean;
  sale_only: boolean;
}

const categories = [
  'educational',
  'outdoor',
  'board games',
  'puzzles',
  'building blocks',
  'dolls',
  'vehicles',
  'action figures',
  'arts & crafts'
];

const ageRanges = [
  '0-2 years',
  '3-5 years',
  '6-8 years',
  '9-12 years',
  '13+ years'
];

export default function ToyForm({ toy, onClose, onSave, isEdit = false }: ToyFormProps) {
  const [formData, setFormData] = useState<Toy>({
    name: '',
    description: '',
    price: 0,
    rental_price: 0,
    stock: 0,
    rental_stock: 0,
    image_url: '',
    category: '',
    age_range: '',
    rental_only: false,
    sale_only: false
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toyType, setToyType] = useState<'both' | 'rental' | 'sale'>('both');

  useEffect(() => {
    if (toy) {
      setFormData(toy);
      
      // Determine toy type
      if (toy.rental_only) {
        setToyType('rental');
      } else if (toy.sale_only) {
        setToyType('sale');
      } else {
        setToyType('both');
      }
    }
  }, [toy]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleToyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'both' | 'rental' | 'sale';
    setToyType(value);
    
    // Update rental_only and sale_only based on toy type
    if (value === 'rental') {
      setFormData(prev => ({ ...prev, rental_only: true, sale_only: false }));
    } else if (value === 'sale') {
      setFormData(prev => ({ ...prev, rental_only: false, sale_only: true }));
    } else {
      setFormData(prev => ({ ...prev, rental_only: false, sale_only: false }));
    }
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Toy name is required');
      }
      
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      
      if (toyType !== 'rental' && formData.price <= 0) {
        throw new Error('Price must be greater than 0 for sale items');
      }
      
      if (toyType !== 'sale' && formData.rental_price <= 0) {
        throw new Error('Rental price must be greater than 0 for rental items');
      }
      
      // Prepare data for submission
      const toyData = {
        ...formData,
        rental_only: toyType === 'rental',
        sale_only: toyType === 'sale',
        // Set appropriate stock values based on toy type
        stock: toyType === 'rental' ? 0 : formData.stock,
        rental_stock: toyType === 'sale' ? 0 : formData.rental_stock,
        // Set appropriate price values based on toy type
        price: toyType === 'rental' ? 0 : formData.price,
        rental_price: toyType === 'sale' ? 0 : formData.rental_price,
        // Ensure category and age_range are never null
        category: formData.category || '',
        age_range: formData.age_range || ''
      };
      
      if (isEdit && toy?.id) {
        // Update existing toy
        const { error: updateError } = await supabase
          .from('toys')
          .update(toyData)
          .eq('id', toy.id);
          
        if (updateError) throw updateError;
      } else {
        // Create new toy
        const { error: insertError } = await supabase
          .from('toys')
          .insert([toyData]);
          
        if (insertError) throw insertError;
      }
      
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving toy:', err);
      setError(err.message || 'Failed to save toy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Toy' : 'Add New Toy'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="toyType" className="block text-sm font-medium text-gray-700 mb-1">
                Toy Type
              </label>
              <select
                id="toyType"
                value={toyType}
                onChange={handleToyTypeChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
              >
                <option value="both">Both Rental and Sale</option>
                <option value="rental">Rental Only</option>
                <option value="sale">Sale Only</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Toy Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(toyType === 'both' || toyType === 'sale') && (
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price (£)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    required={toyType === 'sale'}
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
                  />
                </div>
              )}
              
              {(toyType === 'both' || toyType === 'rental') && (
                <div>
                  <label htmlFor="rental_price" className="block text-sm font-medium text-gray-700 mb-1">
                    Rental Price (£/day)
                  </label>
                  <input
                    type="number"
                    id="rental_price"
                    name="rental_price"
                    min="0"
                    step="0.01"
                    required={toyType === 'rental'}
                    value={formData.rental_price}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(toyType === 'both' || toyType === 'sale') && (
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    required={toyType === 'sale'}
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
                  />
                </div>
              )}
              
              {(toyType === 'both' || toyType === 'rental') && (
                <div>
                  <label htmlFor="rental_stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Rental Stock
                  </label>
                  <input
                    type="number"
                    id="rental_stock"
                    name="rental_stock"
                    min="0"
                    required={toyType === 'rental'}
                    value={formData.rental_stock}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="age_range" className="block text-sm font-medium text-gray-700 mb-1">
                  Age Range
                </label>
                <select
                  id="age_range"
                  name="age_range"
                  value={formData.age_range}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border"
                >
                  <option value="">Select an age range</option>
                  {ageRanges.map(range => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Toy Image
              </label>
              <ImageUpload 
                onImageUploaded={handleImageUploaded}
                existingImageUrl={formData.image_url}
                folder={toyType === 'rental' ? 'rental-toys' : 'sale-toys'}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? 'Update Toy' : 'Add Toy'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
