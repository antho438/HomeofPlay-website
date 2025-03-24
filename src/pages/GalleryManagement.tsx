import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle, GripVertical, Edit2, Trash2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  order: number;
  file_size: number;
  file_type: string;
  created_at: string;
}

export default function GalleryManagement() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    comments: '',
    image_url: '',
    file_size: 0,
    file_type: ''
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }

    fetchGalleryImages();
  }, [user, isAdmin, navigate]);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('gallery_images')
        .select('*')
        .order('order');

      if (fetchError) {
        throw fetchError;
      }

      setImages(data || []);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!formData.image_url) {
        setError('Please select an image');
        return;
      }

      if (editingImage) {
        // Update existing image
        const { error: updateError } = await supabase
          .from('gallery_images')
          .update({
            title: formData.title,
            description: formData.description,
            comments: formData.comments,
            image_url: formData.image_url,
            file_size: formData.file_size,
            file_type: formData.file_type
          })
          .eq('id', editingImage.id);

        if (updateError) throw updateError;
      } else {
        // Add new image
        const { error: insertError } = await supabase
          .from('gallery_images')
          .insert([{
            title: formData.title,
            description: formData.description,
            comments: formData.comments,
            image_url: formData.image_url,
            file_size: formData.file_size,
            file_type: formData.file_type,
            order: images.length
          }]);

        if (insertError) throw insertError;
      }

      setSuccess(editingImage ? 'Image updated successfully' : 'Image added successfully');
      resetForm();
      fetchGalleryImages();
    } catch (err) {
      console.error('Error saving image:', err);
      setError('Failed to save image');
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setSuccess('Image deleted successfully');
      fetchGalleryImages();
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description,
      comments: image.comments || '',
      image_url: image.image_url,
      file_size: image.file_size,
      file_type: image.file_type
    });
    setPreview(image.image_url);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      comments: '',
      image_url: '',
      file_size: 0,
      file_type: ''
    });
    setSelectedFile(null);
    setPreview(null);
    setEditingImage(null);
  };

  const handleImageUploaded = (url: string, fileSize: number, fileType: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: url,
      file_size: fileSize,
      file_type: fileType
    }));
  };

  const handleReorder = async (draggedId: string, targetId: string) => {
    const draggedIndex = images.findIndex(img => img.id === draggedId);
    const targetIndex = images.findIndex(img => img.id === targetId);
    
    const newImages = [...images];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);
    
    // Update order in state
    setImages(newImages);
    
    // Update order in database
    try {
      const updates = newImages.map((img, index) => ({
        id: img.id,
        order: index
      }));
      
      const { error } = await supabase
        .from('gallery_images')
        .upsert(updates);
        
      if (error) throw error;
    } catch (err) {
      console.error('Error updating image order:', err);
      setError('Failed to update image order');
      fetchGalleryImages(); // Revert to original order
    }
  };

  if (!user || !isAdmin) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Gallery Management
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:text-lg">
          Add, edit, and manage gallery images
        </p>
      </div>

      {/* Image Upload Form */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingImage ? 'Edit Image' : 'Add New Image'}
          </h2>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                Comments (Optional)
              </label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                existingImageUrl={formData.image_url}
                folder="gallery"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                {editingImage ? 'Update Image' : 'Add Image'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Gallery Images</h2>
          
          {images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new image above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group bg-white rounded-lg shadow-md overflow-hidden"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', image.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const draggedId = e.dataTransfer.getData('text/plain');
                    handleReorder(draggedId, image.id);
                  }}
                >
                  <div className="aspect-w-3 aspect-h-2">
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">{image.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{image.description}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(image)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <Edit2 className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-5 w-5 text-white drop-shadow-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
