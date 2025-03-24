import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface WishlistItem {
  id: string;
  user_id: string;
  toy_id: string;
  created_at: string;
  toy: {
    id: string;
    name: string;
    description: string;
    price: number;
    rental_price: number;
    image_url: string;
    rental_only: boolean;
    sale_only: boolean;
  };
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  loading: boolean;
  addToWishlist: (toyId: string) => Promise<void>;
  removeFromWishlist: (toyId: string) => Promise<void>;
  isInWishlist: (toyId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          user_id,
          toy_id,
          created_at,
          toy:toys (
            id,
            name,
            description,
            price,
            rental_price,
            image_url,
            rental_only,
            sale_only
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching wishlist:', error);
      } else {
        setWishlistItems(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (toyId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .insert([{ user_id: user.id, toy_id: toyId }]);

      if (error) {
        console.error('Error adding to wishlist:', error);
      } else {
        fetchWishlist();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const removeFromWishlist = async (toyId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('toy_id', toyId);

      if (error) {
        console.error('Error removing from wishlist:', error);
      } else {
        setWishlistItems(wishlistItems.filter(item => item.toy_id !== toyId));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const isInWishlist = (toyId: string) => {
    return wishlistItems.some(item => item.toy_id === toyId);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      loading, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
