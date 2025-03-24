import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, ShoppingBag, Calendar, Plus, Book, Upload, Shield, User, Home, Image } from 'lucide-react';
import ToyManagement from '../components/ToyManagement';
import RentalManagement from '../components/RentalManagement';
import BlogManagement from '../components/BlogManagement';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeRentals: 0,
    totalToys: 0,
    registeredUsers: 0
  });

  const fetchStats = async () => {
    try {
      const { count: rentalsCount } = await supabase
        .from('rentals')
        .select('*', { count: 'exact', head: true })
        .eq('returned', false);

      const { count: toysCount } = await supabase
        .from('toys')
        .select('*', { count: 'exact', head: true });

      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setStats({
        activeRentals: rentalsCount || 0,
        totalToys: toysCount || 0,
        registeredUsers: usersCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (!user || (!isAdmin && !isSuperAdmin)) {
      navigate('/');
      return;
    }
    
    fetchStats();
    setLoading(false);

    const rentalChannel = supabase
      .channel('rentals')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rentals'
      }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(rentalChannel);
    };
  }, [user, isAdmin, isSuperAdmin, navigate]);

  if (loading) {
    return <div className="p-8">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  activeTab === 'dashboard' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('toys')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  activeTab === 'toys' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="h-5 w-5" />
                <span>Toys Management</span>
              </button>
              <button
                onClick={() => setActiveTab('rentals')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  activeTab === 'rentals' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Rentals Management</span>
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                  activeTab === 'blog' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Book className="h-5 w-5" />
                <span>Blog Management</span>
              </button>
            </nav>
          </div>

          <div className="md:col-span-3">
            {activeTab === 'dashboard' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-gray-500 text-sm font-medium">Active Rentals</h3>
                    <p className="text-3xl font-bold mt-2">{stats.activeRentals}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-gray-500 text-sm font-medium">Total Toys</h3>
                    <p className="text-3xl font-bold mt-2">{stats.totalToys}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-gray-500 text-sm font-medium">Registered Users</h3>
                    <p className="text-3xl font-bold mt-2">{stats.registeredUsers}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'toys' && <ToyManagement />}
            {activeTab === 'rentals' && <RentalManagement />}
            {activeTab === 'blog' && <BlogManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}
