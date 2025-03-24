import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Rentals from './pages/Rentals';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Blog from './pages/Blog';
import EducationalBlog from './pages/EducationalBlog';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import LearningGuides from './pages/LearningGuides';
import PlayIdeas from './pages/PlayIdeas';
import SkillDevelopment from './pages/SkillDevelopment';
import DeleteMagneticTiles from './pages/DeleteMagneticTiles';
import DeleteCuddlyToy from './pages/DeleteCuddlyToy';
import ComingSoon from './pages/ComingSoon';
import GalleryManagement from './pages/GalleryManagement';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CartProvider } from './contexts/CartContext';
import Gallery from './components/Gallery';
import SupabaseConnectionStatus from './components/SupabaseConnectionStatus';

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col shadow-[0_0_50px_0_rgba(0,0,0,0.1)]">
              <Navbar />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/rentals" element={<Rentals />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/toys" element={<Admin />} />
                  <Route path="/admin/rentals" element={<Admin />} />
                  <Route path="/admin/blog" element={<Admin />} />
                  <Route path="/admin/gallery" element={<GalleryManagement />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/educational-blog" element={<EducationalBlog />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/payment/cancel" element={<PaymentCancel />} />
                  <Route path="/learning-guides" element={<LearningGuides />} />
                  <Route path="/play-ideas" element={<PlayIdeas />} />
                  <Route path="/skill-development" element={<SkillDevelopment />} />
                  <Route path="/delete-magnetic-tiles" element={<DeleteMagneticTiles />} />
                  <Route path="/delete-cuddly-toy" element={<DeleteCuddlyToy />} />
                  <Route path="/coming-soon" element={<ComingSoon />} />
                </Routes>
              </main>
              <footer className="bg-primary-700 text-white py-8">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4">The Home of Play</h3>
                      <p className="text-primary-100">
                        Quality toy rentals for sustainable play and childhood development.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                      <ul className="space-y-2">
                        <li><a href="/" className="text-primary-100 hover:text-white">Home</a></li>
                        <li><a href="/shop" className="text-primary-100 hover:text-white">Shop</a></li>
                        <li><a href="/rentals" className="text-primary-100 hover:text-white">Rentals</a></li>
                        <li><a href="/blog" className="text-primary-100 hover:text-white">Blog</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                      <p className="text-primary-100">
                        Email: emma@thehomeofplay.co.uk<br />                                             
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-primary-600 text-center">
                    <p className="text-primary-100">© 2025 The Home of Play. All rights reserved.</p>
                  </div>
                </div>
              </footer>
              <Gallery />
              <SupabaseConnectionStatus />
            </div>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
