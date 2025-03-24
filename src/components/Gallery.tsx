import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  order: number;
  created_at: string;
}

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  // Function to fetch gallery images
  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('gallery_images')
        .select('*')
        .order('order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setImages(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
      setError('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
    const timer = setTimeout(() => setShowPopup(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const subscription = supabase
      .channel('gallery_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gallery_images' },
        () => fetchGalleryImages()
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (!loading) fetchGalleryImages();
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [loading]);

  const handleImageTransition = async (direction: 'next' | 'prev') => {
    if (transitioning || !images.length) return;
    
    setTransitioning(true);
    
    if (selectedPost === null) return;
    
    const newIndex = direction === 'next'
      ? (selectedPost + 1) % images.length
      : (selectedPost - 1 + images.length) % images.length;
    
    setSelectedPost(newIndex);
    
    // Allow time for transition animation
    setTimeout(() => setTransitioning(false), 300);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
      fetchGalleryImages();
    }
  };

  const expandGallery = () => {
    setIsExpanded(true);
    fetchGalleryImages();
  };

  const closeGallery = () => {
    setIsExpanded(false);
    setSelectedPost(null);
  };

  const openPost = (index: number) => {
    setSelectedPost(index);
  };

  const nextPost = () => handleImageTransition('next');
  const prevPost = () => handleImageTransition('prev');
  const closePopup = () => setShowPopup(false);

  if (!showPopup) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleOpen}
        className="bg-gradient-to-tr from-primary-600 to-primary-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        aria-label="Open Gallery"
      >
        <ImageIcon className="h-6 w-6" />
      </button>

      {isOpen && !isExpanded && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-3 w-64 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center">
              <ImageIcon className="h-4 w-4 mr-1 text-primary-500" />
              Our Gallery
            </h3>
            <button onClick={toggleOpen} className="text-gray-400 hover:text-gray-500">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500 text-sm">{error}</div>
          ) : images.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No images available</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-1 mb-2">
                {images.slice(0, 6).map((image, index) => (
                  <div 
                    key={image.id} 
                    className="aspect-square overflow-hidden rounded-sm cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openPost(index)}
                  >
                    <img 
                      src={image.image_url} 
                      alt={image.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button 
                  onClick={expandGallery}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Gallery
                </button>
                <span className="text-xs text-gray-600">
                  {images.length} photos
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                <p className="mb-4">{error}</p>
                <button 
                  onClick={fetchGalleryImages}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : selectedPost !== null && images.length > 0 ? (
              <div className="relative">
                <button onClick={closeGallery} className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors">
                  <X className="h-6 w-6" />
                </button>
                
                <div className="relative flex items-center justify-center">
                  <img 
                    src={images[selectedPost].image_url} 
                    alt={images[selectedPost].title} 
                    className={`max-h-[80vh] max-w-full object-contain transition-opacity duration-300 ${transitioning ? 'opacity-50' : 'opacity-100'}`}
                  />
                  
                  <button 
                    onClick={prevPost}
                    className="absolute left-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all transform hover:scale-110"
                    disabled={transitioning}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  
                  <button 
                    onClick={nextPost}
                    className="absolute right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all transform hover:scale-110"
                    disabled={transitioning}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-6">
                  <h3 className="text-xl font-semibold mb-2">{images[selectedPost].title}</h3>
                  <p className="text-gray-300">{images[selectedPost].description}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div 
                    key={image.id} 
                    className="aspect-square overflow-hidden rounded-lg cursor-pointer relative group"
                    onClick={() => openPost(index)}
                  >
                    <img 
                      src={image.image_url} 
                      alt={image.title} 
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        View
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showPopup && !isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-64 animate-bounce-in">
          <button onClick={closePopup} className="absolute top-2 right-2 text-gray-400 hover:text-gray-500">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center mb-3">
            <div className="bg-gradient-to-tr from-primary-600 to-primary-500 p-2 rounded-full mr-3">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <p className="font-medium text-gray-800">Check out our gallery!</p>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            See our latest toys, play ideas, and special offers.
          </p>
          <button 
            onClick={toggleOpen}
            className="w-full py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-md hover:from-primary-700 hover:to-primary-600 transition-colors"
          >
            View Gallery
          </button>
        </div>
      )}
    </div>
  );
}
