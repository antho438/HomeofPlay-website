import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (url: string, fileSize: number, fileType: string) => void;
  existingImageUrl?: string;
  folder?: string;
}

export default function ImageUpload({ 
  onImageUploaded, 
  existingImageUrl,
  folder = 'toys'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setSuccess(false);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      // Call the callback with the URL, file size, and file type
      onImageUploaded(publicUrl, file.size, file.type);
      setSuccess(true);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Failed to upload image');
      setPreview(existingImageUrl);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setSuccess(false);
    onImageUploaded('', 0, '');
  };

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreview(url);
    
    // For external URLs, fetch the image to get its size and type
    if (url) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        onImageUploaded(url, blob.size, blob.type || 'image/jpeg'); // Default to JPEG if type is not available
      } catch (error) {
        console.error('Error fetching image:', error);
        onImageUploaded(url, 0, 'image/jpeg'); // Fallback values
      }
    } else {
      onImageUploaded('', 0, '');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Image Upload
        </label>
        {preview && (
          <button
            type="button"
            onClick={clearImage}
            className="text-xs text-red-600 hover:text-red-800 flex items-center"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </button>
        )}
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="url"
          placeholder="Enter image URL"
          value={preview || ''}
          onChange={handleUrlChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2 border text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter a URL or upload an image below
        </p>
      </div>
      
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-300 h-48 w-full">
          <img 
            src={preview} 
            alt="Preview" 
            className="h-full w-full object-cover"
            onError={() => setError('Invalid image URL')}
          />
          <div className="absolute bottom-2 right-2">
            {success && (
              <div className="bg-green-100 text-green-800 p-1 rounded-full">
                <CheckCircle className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-48 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
            <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 5MB
            </span>
          </label>
        </div>
      )}
      
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
      
      {uploading && (
        <div className="mt-2 flex justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
        </div>
      )}
    </div>
  );
}
