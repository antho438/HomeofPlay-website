import React, { useState, useEffect } from 'react';
import { Instagram, X, ChevronLeft, ChevronRight, ExternalLink, LogIn } from 'lucide-react';
import { fetchInstagramPosts, initiateInstagramAuth, hasInstagramToken } from '../lib/instagram';

// Instagram account username to display in the gallery
const INSTAGRAM_USERNAME = 'homeofplay'; // Replace with your actual Instagram username

interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  date: string;
  permalink: string;
}

// Sample Instagram posts - these will be shown until you connect your real Instagram account
const samplePosts: InstagramPost[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    caption: 'Our new wooden block set is perfect for creative play! #sustainabletoys #woodentoys',
    likes: 45,
    date: '2 days ago',
    permalink: 'https://www.instagram.com/'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1596460107916-430662021049?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    caption: 'Sensory play is essential for development. These colorful toys stimulate multiple senses! #earlylearning',
    likes: 72,
    date: '5 days ago',
    permalink: 'https://www.instagram.com/'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    caption: 'Our rental toys are carefully sanitized between each use. Safety first! #toyrentals #ecofriendly',
    likes: 38,
    date: '1 week ago',
    permalink: 'https://www.instagram.com/'
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    caption: 'Building blocks help develop spatial awareness and problem-solving skills. #learningthroughplay',
    likes: 56,
    date: '2 weeks ago',
    permalink: 'https://www.instagram.com/'
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    caption: 'Just received our new shipment of eco-friendly toys! Can\'t wait to share them with you. #sustainabletoys',
    likes: 63,
    date: '3 weeks ago',
    permalink: 'https://www.instagram.com/'
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1551124054-0324d6279118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    caption: 'Our monthly toy subscription boxes are now available! Get a curated selection delivered to your door. #toysubscription',
    likes: 89,
    date: '1 month ago',
    permalink: 'https://www.instagram.com/'
  }
];

export default function InstagramGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [posts, setPosts] = useState<InstagramPost[]>(samplePosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  const [demoMode, setDemoMode] = useState(false); // Demo mode disabled by default

  // Check if we have an Instagram token on component mount
  useEffect(() => {
    console.log('InstagramGallery component mounted');
    const hasToken = hasInstagramToken();
    setIsAuthenticated(hasToken);
    
    // If we have a token, try to fetch real posts
    if (hasToken) {
      console.log('Token found, fetching posts');
      getRealInstagramPosts();
    }
    
    // Show the popup after a delay
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Check for Instagram auth callback in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state && window.location.pathname.includes('/auth/instagram/callback')) {
      console.log('Detected Instagram callback in URL');
      handleAuthCallback(code, state);
    }
  }, []);

  const handleAuthCallback = async (code: string, state: string) => {
    try {
      console.log('Handling auth callback in InstagramGallery');
      // This would be implemented in a real app
      // For now, we'll just set authenticated to true
      setIsAuthenticated(true);
      
      // Remove the query parameters from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Try to fetch real posts
      getRealInstagramPosts();
    } catch (error) {
      console.error('Error handling auth callback:', error);
      setError('Failed to authenticate with Instagram. Please try again.');
    }
  };

  const getRealInstagramPosts = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to fetch real Instagram posts');
      // In a real implementation, this would fetch from the Instagram API
      // For now, we'll just use the sample data with a delay
      setTimeout(() => {
        setPosts(samplePosts);
        setLoading(false);
        console.log('Loaded sample posts (simulating real posts)');
      }, 1000);
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      setError('Failed to load Instagram posts. Please try again later.');
      setLoading(false);
    }
  };

  const handleConnectInstagram = () => {
    console.log('Connect Instagram button clicked');
    setConnectionAttempted(true);
    
    if (demoMode) {
      // In demo mode, simulate a successful authentication
      setIsAuthenticated(true);
      localStorage.setItem('instagram_access_token', 'demo_token_' + Date.now());
      getRealInstagramPosts();
    } else {
      // In a real implementation, this would redirect to Instagram auth
      initiateInstagramAuth();
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
    }
  };

  const expandGallery = () => {
    setIsExpanded(true);
  };

  const closeGallery = () => {
    setIsExpanded(false);
    setSelectedPost(null);
  };

  const openPost = (index: number) => {
    setSelectedPost(index);
  };

  const nextPost = () => {
    if (selectedPost !== null) {
      setSelectedPost((selectedPost + 1) % posts.length);
    }
  };

  const prevPost = () => {
    if (selectedPost !== null) {
      setSelectedPost((selectedPost - 1 + posts.length) % posts.length);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const toggleDemoMode = () => {
    setDemoMode(!demoMode);
  };

  // If the popup is not shown, only render the button
  if (!showPopup) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Instagram Button */}
      <button
        onClick={toggleOpen}
        className="bg-gradient-to-tr from-purple-600 to-pink-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        aria-label="Open Instagram Gallery"
      >
        <Instagram className="h-6 w-6" />
      </button>

      {/* Mini Gallery */}
      {isOpen && !isExpanded && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-3 w-64 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center">
              <Instagram className="h-4 w-4 mr-1 text-pink-500" />
              Follow us on Instagram
            </h3>
            <button onClick={toggleOpen} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500 text-sm">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-1 mb-2">
                {posts.slice(0, 6).map((post, index) => (
                  <div 
                    key={post.id} 
                    className="aspect-square overflow-hidden rounded-sm cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openPost(index)}
                  >
                    <img 
                      src={post.imageUrl} 
                      alt="Instagram post" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button 
                  onClick={expandGallery}
                  className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                >
                  View Gallery
                </button>
                <a 
                  href={`https://www.instagram.com/${INSTAGRAM_USERNAME}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 hover:text-gray-800 flex items-center"
                >
                  @{INSTAGRAM_USERNAME}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </>
          )}
        </div>
      )}

      {/* Full Gallery Modal */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Instagram className="h-5 w-5 mr-2 text-pink-500" />
                @{INSTAGRAM_USERNAME} on Instagram
              </h2>
              <button onClick={closeGallery} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {loading ? (
              <div className="flex-grow flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              </div>
            ) : error ? (
              <div className="flex-grow flex justify-center items-center py-12">
                <div className="text-center text-red-500">
                  <p className="mb-4">{error}</p>
                  <button 
                    onClick={getRealInstagramPosts}
                    className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : !isAuthenticated ? (
              <div className="flex-grow flex flex-col justify-center items-center py-12">
                <div className="text-center mb-6">
                  <Instagram className="h-16 w-16 text-pink-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Connect to Instagram</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Connect your Instagram account to display your real Instagram posts in this gallery.
                  </p>
                  {connectionAttempted && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                      <p className="text-sm text-yellow-800">
                        If you're seeing a blank page or error after clicking connect, please check that your app is properly configured in the Facebook Developer Dashboard:
                      </p>
                      <ul className="mt-2 text-xs text-yellow-700 list-disc list-inside">
                        <li>Verify your redirect URI is set to: {window.location.origin}/auth/instagram/callback</li>
                        <li>Ensure your app is in Development mode</li>
                        <li>Add yourself as a test user in the Instagram Basic Display settings</li>
                      </ul>
                    </div>
                  )}
                  
                  {/* Demo mode toggle */}
                  <div className="mt-4 flex items-center justify-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={demoMode} 
                        onChange={toggleDemoMode} 
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                      <span className="ms-3 text-sm font-medium text-gray-600">Demo Mode</span>
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleConnectInstagram}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:from-purple-700 hover:to-pink-600 transition-colors"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  {demoMode ? "Connect in Demo Mode" : "Connect Instagram Account"}
                </button>
              </div>
            ) : selectedPost !== null ? (
              <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
                <div className="md:w-1/2 bg-black flex items-center justify-center relative">
                  <img 
                    src={posts[selectedPost].imageUrl} 
                    alt="Instagram post" 
                    className="max-h-[60vh] max-w-full object-contain"
                  />
                  <button 
                    onClick={prevPost} 
                    className="absolute left-2 bg-white bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={nextPost} 
                    className="absolute right-2 bg-white bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
                <div className="md:w-1/2 p-4 overflow-y-auto">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">@{INSTAGRAM_USERNAME}</h3>
                    <p className="text-gray-700">{posts[selectedPost].caption}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">{posts[selectedPost].likes} likes</span>
                    <span>{posts[selectedPost].date}</span>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <a 
                      href={posts[selectedPost].permalink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Instagram
                    </a>
                    <a 
                      href={`https://www.instagram.com/${INSTAGRAM_USERNAME}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:from-purple-700 hover:to-pink-600 transition-colors"
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Follow
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto">
                {posts.map((post, index) => (
                  <div 
                    key={post.id} 
                    className="aspect-square overflow-hidden rounded-md cursor-pointer hover:opacity-90 transition-opacity relative group"
                    onClick={() => openPost(index)}
                  >
                    <img 
                      src={post.imageUrl} 
                      alt="Instagram post" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium">View</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="p-4 border-t">
              <p className="text-sm text-gray-500 text-center">
                Follow us <a href={`https://www.instagram.com/${INSTAGRAM_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">@{INSTAGRAM_USERNAME}</a> for more updates and inspiration
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Initial Popup */}
      {showPopup && !isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-64 animate-bounce-in">
          <button onClick={closePopup} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center mb-3">
            <div className="bg-gradient-to-tr from-purple-600 to-pink-500 p-2 rounded-full mr-3">
              <Instagram className="h-5 w-5 text-white" />
            </div>
            <p className="font-medium text-gray-800">Check out our Instagram!</p>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Follow us for the latest updates, toy inspiration, and special offers.
          </p>
          <button 
            onClick={toggleOpen}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:from-purple-700 hover:to-pink-600 transition-colors"
          >
            View Gallery
          </button>
        </div>
      )}
    </div>
  );
}
