import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Package, Home, Settings, Book, UserCircle, Heart, ShoppingBag, Shield, Database } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { isSupabaseConnected } from '../lib/supabase';

export default function Navbar() {
  const { user, isAdmin, isSuperAdmin, signOut } = useAuth();
  const { wishlistItems } = useWishlist();
  const { cartItems } = useCart();
  const supabaseConnected = isSupabaseConnected();

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <img src="https://imgur.com/1G2tf0q.jpg" alt="Home of Play Logo" className="h-10 w-10 rounded-full object-cover shadow-md" />
              <span className="text-2xl font-bold text-white">The Home of Play</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-1 text-white hover:text-primary-100 transition-colors">
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </Link>
              <Link to="/shop" className="flex items-center space-x-1 text-white hover:text-primary-100 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-medium">Shop</span>
              </Link>
              <Link to="/rentals" className="flex items-center space-x-1 text-white hover:text-primary-100 transition-colors">
                <Package className="h-5 w-5" />
                <span className="font-medium">Rentals</span>
              </Link>
              <Link to="/blog" className="flex items-center space-x-1 text-white hover:text-primary-100 transition-colors">
                <Book className="h-5 w-5" />
                <span className="font-medium">Blog</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!supabaseConnected && (
              <div className="flex items-center px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-medium">
                <Database className="h-4 w-4 mr-1" />
                <span>Supabase Disconnected</span>
              </div>
            )}
            
            {user && (
              <>
                <Link to="/wishlist" className="flex items-center space-x-1 text-white hover:text-primary-100 transition-colors relative">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">Wishlist</span>
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="flex items-center space-x-1 text-white hover:text-primary-100 transition-colors relative">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="font-medium">Cart</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="flex items-center space-x-1 text-white hover:text-primary-100 transition-colors">
                  <UserCircle className="h-5 w-5" />
                  <span className="font-medium">My Profile</span>
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className="flex items-center space-x-1 text-white hover:text-primary-100 transition-colors">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Admin</span>
              </Link>
            )}
            {isSuperAdmin && (
              <Link to="/admin" className="flex items-center space-x-1 text-white hover:text-primary-100 transition-colors">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Super Admin</span>
              </Link>
            )}
            {user ? (
              <button
                onClick={() => signOut()}
                className="bg-white text-primary-600 px-6 py-2 rounded-full font-medium hover:bg-primary-50 transition-colors shadow-md"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-white text-primary-600 px-6 py-2 rounded-full font-medium hover:bg-primary-50 transition-colors shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
