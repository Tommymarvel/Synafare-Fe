'use client';

import { useState } from 'react';
import { Input } from '@/app/components/form/Input';
import { Button } from '@/app/components/ui/Button';
import { X } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';

interface RequestQuoteWithQuantityModalProps {
  onClose: () => void;
  onSuccess: () => void;
  productId: string;
  supplierId: string;
  productTitle?: string;
}

export default function RequestQuoteWithQuantityModal({
  onClose,
  onSuccess,
  productId,
  supplierId,
  productTitle,
}: RequestQuoteWithQuantityModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!quantity || !deliveryLocation) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post('/quote-requests/single', {
        supplier: supplierId,
        items: [{ product: productId, quantity }],
        delivery_location: deliveryLocation,
        additional_message: additionalMessage || undefined,
      });

      if (response.data.message === 'Request sent successfully') {
        console.log('Quote request submitted successfully:', response.data);
        onClose();
        onSuccess();
      } else {
        console.warn('Unexpected API response:', response.data);
      }
    } catch (error) {
      console.error('Failed to submit quote request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-2">Request Quote</h2>
        {productTitle && (
          <p className="text-sm text-gray-600 mb-4">For: {productTitle}</p>
        )}

        <div className="space-y-4">
          <Input
            name="quantity"
            label="Quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />

          <Input
            name="delivery_location"
            label="Delivery Location"
            placeholder="Enter your delivery address"
            value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Additional Message
            </label>
            <textarea
              value={additionalMessage}
              onChange={(e) => setAdditionalMessage(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-[#D0D5DD] p-4 placeholder:text-[#98A2B3] focus:border-mikado focus:ring-2 focus:ring-mikado focus:outline-none text-raisin transition"
              placeholder="Any special requirements or notes..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
