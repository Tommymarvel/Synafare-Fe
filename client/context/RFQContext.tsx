'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { RFQItem, ApiRFQCartResponse } from '@/types/marketplace.types';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface RFQContextType {
  rfqItems: RFQItem[];
  loading: boolean;
  addToRFQ: (
    productId: string,
    productName: string,
    supplierId: string
  ) => Promise<void>;
  removeFromRFQ: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  isInRFQ: (productId: string) => boolean;
  clearRFQ: () => Promise<void>;
  refreshRFQ: () => Promise<void>;
}

const RFQContext = createContext<RFQContextType | undefined>(undefined);

export const useRFQ = () => {
  const context = useContext(RFQContext);
  if (!context) {
    throw new Error('useRFQ must be used within an RFQProvider');
  }
  return context;
};

interface RFQProviderProps {
  children: ReactNode;
}

export const RFQProvider: React.FC<RFQProviderProps> = ({ children }) => {
  const [rfqItems, setRfqItems] = useState<RFQItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch RFQ cart from API
  const fetchRFQCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<ApiRFQCartResponse>('/rfq-cart');

      // Transform API response to RFQItem format
      const transformedItems: RFQItem[] = [];
      response.data.rfqCart.forEach((cart) => {
        cart.items.forEach((item) => {
          transformedItems.push({
            id: `${cart.supplier._id}-${item.product._id}`, // Unique ID combining supplier and product
            productId: item.product._id,
            productName: item.product.name,
            quantity: item.quantity,
            supplierId: cart.supplier._id,
            supplierName: cart.supplier.name,
            dateAdded: new Date().toISOString(), // API doesn't provide this, use current date
          });
        });
      });

      setRfqItems(transformedItems);
    } catch (error) {
      console.error('Failed to fetch RFQ cart:', error);
      setRfqItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Load RFQ cart on mount
  useEffect(() => {
    fetchRFQCart();
  }, []);

  const addToRFQ = async (
    productId: string,
    productName: string,
    supplierId: string
  ) => {
    try {
      // Check if item already exists
      if (rfqItems.some((item) => item.productId === productId)) {
        toast.info('Product already in cart');
        return;
      }

      // Add to API with proper structure
      await axiosInstance.post('/rfq-cart/add', {
        supplier: supplierId,
        product: productId,
        quantity: 1,
      });

      // Refresh the cart to get updated data
      await fetchRFQCart();

      toast.success('Product added to cart');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        (axiosError.response && axiosError.response.data
          ? axiosError.response.data.message || axiosError.response.data
          : axiosError.message || 'An error occurred'
        ).toString()
      );
    }
  };

  const removeFromRFQ = async (productId: string) => {
    try {
      // Find the item to get supplier information
      const item = rfqItems.find((item) => item.productId === productId);
      if (!item || !item.supplierId) {
        toast.error('Item not found in cart');
        return;
      }

      // Remove from API using correct endpoint: DELETE /rfq-cart/:supplierId/:productId
      await axiosInstance.delete(`/rfq-cart/${item.supplierId}/${productId}`);

      // Update local state
      setRfqItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );

      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove from RFQ:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      // Find the item to get supplier information
      const item = rfqItems.find((item) => item.productId === productId);
      if (!item || !item.supplierId) {
        toast.error('Item not found in cart');
        return;
      }

      // Update quantity via API: PATCH /rfq-cart/:supplierId/:productId
      await axiosInstance.patch(`/rfq-cart/${item.supplierId}/${productId}`, {
        quantity,
      });

      // Update local state
      setRfqItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );

      toast.success('Quantity updated successfully');
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    }
  };
  const isInRFQ = (productId: string) => {
    return rfqItems.some((item) => item.productId === productId);
  };

  const clearRFQ = async () => {
    try {
      // Clear all items by removing each supplier's cart
      const response = await axiosInstance.get<ApiRFQCartResponse>('/rfq-cart');

      // Remove each supplier's cart
      await Promise.all(
        response.data.rfqCart.map(async (cart) => {
          // Remove all items from this supplier's cart
          await Promise.all(
            cart.items.map((item) =>
              axiosInstance.delete(
                `/rfq-cart/${cart.supplier._id}/${item.product._id}`
              )
            )
          );
        })
      );

      // Update local state
      setRfqItems([]);
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Failed to clear RFQ:', error);
      toast.error('Failed to clear cart');
    }
  };

  const refreshRFQ = async () => {
    await fetchRFQCart();
  };

  return (
    <RFQContext.Provider
      value={{
        rfqItems,
        loading,
        addToRFQ,
        removeFromRFQ,
        updateQuantity,
        isInRFQ,
        clearRFQ,
        refreshRFQ,
      }}
    >
      {children}
    </RFQContext.Provider>
  );
};
