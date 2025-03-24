import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Stars, BookOpen, Lightbulb, Puzzle, Smile } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="relative py-8 rounded-2xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 mb-8">
          <div className="relative">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Welcome to The Home of Play
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl text-white sm:text-2xl md:mt-5 md:max-w-3xl">
              From our home to yours!
            </p>
          </div>
        </div>
      </div>

      {/* Text section between banner and buttons */}
      <div className="mt-8 mb-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Sustainable Play for Every Child</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
          At Home of Play, we believe that quality toys shouldn't just be used once and forgotten. 
          Our toy rental service helps families reduce waste while giving children access to a 
          variety of educational and fun toys that support their development at every stage.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Link
          to="/rentals"
          className="relative group bg-gradient-to-br from-primary-100 to-primary-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-200"
        >
          <div className="absolute -top-5 right-5 bg-primary-500 rounded-full p-3 shadow-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div className="mt-3 text-center">
            <h3 className="text-xl font-bold text-primary-700">Rent Toys</h3>
            <p className="mt-2 text-sm text-primary-600">
              Try before you buy or rent for special occasions
            </p>
          </div>
        </Link>

        <Link
          to="/shop"
          className="relative group bg-gradient-to-br from-secondary-100 to-secondary-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-secondary-200"
        >
          <div className="absolute -top-5 right-5 bg-secondary-500 rounded-full p-3 shadow-lg">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <div className="mt-3 text-center">
            <h3 className="text-xl font-bold text-secondary-700">Shop Toys</h3>
            <p className="mt-2 text-sm text-secondary-600">
              Browse our collection of quality toys
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-24 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl shadow-xl overflow-hidden">
        <div className="px-8 py-12">
          <h2 className="text-3xl font-bold text-primary-700 text-center mb-12">How It Works</h2>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Stars className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-primary-700">1. Browse</h3>
              <p className="mt-2 text-primary-600">
                Explore our magical collection of toys
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Package className="h-8 w-8 text-secondary-500" />
              </div>
              <h3 className="text-xl font-bold text-secondary-700">2. Choose</h3>
              <p className="mt-2 text-secondary-600">
                Pick your perfect playtime companion
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Smile className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-primary-700">3. Enjoy</h3>
              <p className="mt-2 text-primary-600">
                Create magical memories together
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content Section */}
      <div className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Educational Resources</h2>
          <p className="mt-3 text-xl text-gray-500">
            Discover the developmental benefits of play
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary-100 rounded-full p-3">
                  <BookOpen className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Learning Guides</h3>
              <p className="text-gray-600 text-center">
                Age-appropriate toy guides to support your child's development at every stage.
              </p>
              <div className="mt-4 text-center">
                <Link to="/learning-guides" className="text-primary-600 font-medium hover:text-primary-700">
                  Explore guides →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary-100 rounded-full p-3">
                  <Lightbulb className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Play Ideas</h3>
              <p className="text-gray-600 text-center">
                Creative activities and play suggestions to maximize the educational value of our toys.
              </p>
              <div className="mt-4 text-center">
                <Link to="/play-ideas" className="text-primary-600 font-medium hover:text-primary-700">
                  Get inspired →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary-100 rounded-full p-3">
                  <Puzzle className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Skill Development</h3>
              <p className="text-gray-600 text-center">
                Learn how different toys help develop specific skills like motor coordination, problem-solving, and creativity.
              </p>
              <div className="mt-4 text-center">
                <Link to="/skill-development" className="text-primary-600 font-medium hover:text-primary-700">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Educational Content */}
      <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1566140967404-b8b3932483f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Children playing with wooden toys" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-8 md:w-1/2">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              The Importance of Play in Early Childhood Development
            </h3>
            <p className="text-gray-600 mb-4">
              Play is not just fun—it's how children learn about the world around them. Through play, children develop crucial cognitive, physical, social, and emotional skills that form the foundation for future learning.
            </p>
            <p className="text-gray-600 mb-6">
              Our carefully curated wooden toy collection is designed to support various aspects of development while keeping playtime engaging and enjoyable.
            </p>
            <Link 
              to="/blog" 
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Read Our Educational Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
