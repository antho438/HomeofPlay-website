import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  toy_id: string;
  user_id: string;
  quantity: number;
  is_rental: boolean;
  rental_start_date?: string;
  rental_end_date?: string;
  created_at: string;
  toy: {
    id: string;
    name: string;
    description: string;
    price: number;
    rental_price: number;
    image_url: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (toyId: string, quantity: number, isRental: boolean, startDate?: string, endDate?: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  updateRentalDates: (cartItemId: string, startDate: string, endDate: string) => Promise<void>;
  clearCart: () => Promise<void>;
  calculateSubtotal: () => number;
  calculateVAT: () => number;
  calculateTotal: () => number;
  calculateRentalDays: (startDate: string, endDate: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          toy_id,
          user_id,
          quantity,
          is_rental,
          rental_start_date,
          rental_end_date,
          created_at,
          toy:toys (
            id,
            name,
            description,
            price,
            rental_price,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart:', error);
      } else {
        setCartItems(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    toyId: string, 
    quantity: number, 
    isRental: boolean,
    startDate?: string,
    endDate?: string
  ) => {
    if (!user) return;

    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find(
        item => item.toy_id === toyId && item.is_rental === isRental
      );

      if (existingItem) {
        // Update quantity if item exists
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
        
        // Update rental dates if it's a rental
        if (isRental && startDate && endDate) {
          await updateRentalDates(existingItem.id, startDate, endDate);
        }
      } else {
        // Add new item to cart
        const { error } = await supabase
          .from('cart_items')
          .insert([{ 
            user_id: user.id, 
            toy_id: toyId, 
            quantity,
            is_rental: isRental,
            rental_start_date: isRental ? startDate : null,
            rental_end_date: isRental ? endDate : null
          }]);

        if (error) {
          console.error('Error adding to cart:', error);
        } else {
          fetchCart();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing from cart:', error);
      } else {
        setCartItems(cartItems.filter(item => item.id !== cartItemId));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!user || quantity < 1) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating quantity:', error);
      } else {
        setCartItems(cartItems.map(item => 
          item.id === cartItemId ? { ...item, quantity } : item
        ));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateRentalDates = async (cartItemId: string, startDate: string, endDate: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ 
          rental_start_date: startDate,
          rental_end_date: endDate
        })
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating rental dates:', error);
      } else {
        setCartItems(cartItems.map(item => 
          item.id === cartItemId 
            ? { ...item, rental_start_date: startDate, rental_end_date: endDate } 
            : item
        ));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculateRentalDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 day
  };

  const calculateSubtotal = (): number => {
    return cartItems.reduce((total, item) => {
      if (item.is_rental && item.rental_start_date && item.rental_end_date) {
        const days = calculateRentalDays(item.rental_start_date, item.rental_end_date);
        return total + (item.toy.rental_price * days * item.quantity);
      } else {
        return total + (item.toy.price * item.quantity);
      }
    }, 0);
  };

  const calculateVAT = (): number => {
    return calculateSubtotal() * 0.2; // 20% VAT in the UK
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateVAT();
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      loading, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      updateRentalDates,
      clearCart,
      calculateSubtotal,
      calculateVAT,
      calculateTotal,
      calculateRentalDays
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
