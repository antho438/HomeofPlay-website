import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ToyCard from '../components/ToyCard';

export default function Wishlist() {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          My Wishlist
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:text-lg">
          Keep track of toys you're interested in renting or buying.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <Heart className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Browse our collection of toys and add your favorites to your wishlist.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => navigate('/rentals')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <Package className="h-5 w-5 mr-2" />
              Browse Rentals
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Browse Shop
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/rentals')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Browse More Toys
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((item) => (
              <ToyCard
                key={item.id}
                id={item.toy.id}
                name={item.toy.name}
                description={item.toy.description}
                price={item.toy.price}
                rentalPrice={item.toy.rental_price}
                imageUrl={item.toy.image_url}
                isRental={item.toy.rental_only || (!item.toy.sale_only && item.toy.rental_price > 0)}
                isSale={item.toy.sale_only || (!item.toy.rental_only && item.toy.price > 0)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
