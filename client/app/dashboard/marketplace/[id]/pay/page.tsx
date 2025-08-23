'use client';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/app/components/form/Input';
import { Button } from '@/app/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { marketplaceApi, transformApiProduct } from '@/lib/marketplaceApi';
import { ProductListingType } from '@/types/marketplace.types';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axiosInstance';
import Image from 'next/image';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const OrderSchema = Yup.object().shape({
  delivery_location: Yup.string().required('Delivery location is required'),
  payment_method: Yup.string().required('Select a payment method'),
});

export default function OrderSummary({ params }: PageProps) {
  const [productId, setProductId] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState<ProductListingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  // Extract the id from async params
  useEffect(() => {
    const extractId = async () => {
      const { id } = await params;
      setProductId(id);
    };
    extractId();
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const apiProduct = await marketplaceApi.getProductById(productId);
        const transformedProduct = transformApiProduct(apiProduct);
        setProduct(transformedProduct);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading payment details...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-red-500">Product not found</div>
        </div>
      </div>
    );
  }

  if (!product.price) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Go Back
        </button>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Not Available
          </h1>
          <p className="text-gray-600 mb-6">
            This product is available by quote only. Please request a quote
            instead.
          </p>
          <button
            onClick={() => router.push(`/dashboard/marketplace/${productId}`)}
            className="bg-mikado-yellow text-white px-6 py-2 rounded-lg hover:bg-mikado-yellow/90"
          >
            Go Back to Product
          </button>
        </div>
      </div>
    );
  }

  const unitPrice = product.price;
  const total = unitPrice * qty;
  const canAfford = user?.wallet_balance && user.wallet_balance >= total;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Go Back
      </button>

      <h1 className="text-2xl font-semibold mb-8 text-center">Order Summary</h1>
      <p className="text-gray-500 text-center mb-6">
        Select your payment method and proceed to pay
      </p>

      {/* Product card */}
      <div className="border rounded-lg p-4 flex items-start space-x-4 mb-6">
        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
          <Image
            src={product.src}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="font-medium">{product.title}</p>
          <p className="text-xs text-gray-500">
            {product.sku} | {product.category} | {product.brand}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            by {product.supplier_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setQty(Math.max(1, qty - 1))}
          >
            -
          </button>
          <span className="px-2">{qty}</span>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setQty(qty + 1)}
          >
            +
          </button>
        </div>
      </div>

      {/* Form */}
      <Formik
        initialValues={{
          delivery_location: '',
          payment_method: '',
        }}
        validationSchema={OrderSchema}
        onSubmit={async (values) => {
          setProcessing(true);
          try {
            if (values.payment_method === 'wallet') {
              // Use the wallet payment API
              const response = await axiosInstance.post('/inventory/buy', {
                quantity_to_be_bought: qty,
                delivery_location: values.delivery_location,
                invent_id: productId,
              });

              if (response.data.message === 'Payment Successfull') {
                // Refresh user data to get updated wallet balance
                await refreshUser();

                alert('Payment successful! Your order has been placed.');
                router.push('/dashboard/marketplace');
              }
            } else {
              // Handle other payment methods (card, bank transfer)
              alert(
                'This payment method is not implemented yet. Please use wallet payment.'
              );
            }
          } catch (error: unknown) {
            console.error('Payment failed:', error);

            // Handle specific API errors
            if (error && typeof error === 'object' && 'response' in error) {
              const axiosError = error as {
                response?: { data?: { message?: string } };
              };
              const errorMessage = axiosError.response?.data?.message;

              if (errorMessage?.includes('Insufficient funds')) {
                alert(
                  'Insufficient wallet balance. Please top up your wallet and try again.'
                );
              } else if (errorMessage?.includes('out of stock')) {
                alert('Sorry, this item is out of stock.');
              } else if (errorMessage?.includes('Not enough stock')) {
                alert('Not enough stock available for this quantity.');
              } else if (errorMessage) {
                alert(`Payment failed: ${errorMessage}`);
              } else {
                alert('Payment failed. Please try again.');
              }
            } else {
              alert('Payment failed. Please try again.');
            }
          } finally {
            setProcessing(false);
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium">Price</label>
              <div className="bg-gray-100 rounded-md px-3 py-2 mt-1">
                <div className="flex justify-between text-sm">
                  <span>Unit Price:</span>
                  <span>
                    ₦{new Intl.NumberFormat('en-NG').format(unitPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Quantity:</span>
                  <span>{qty}</span>
                </div>
                <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                  <span>Total:</span>
                  <span>₦{new Intl.NumberFormat('en-NG').format(total)}</span>
                </div>
              </div>
            </div>

            {/* Wallet Balance */}
            {user?.wallet_balance !== undefined && (
              <div>
                <label className="block text-sm font-medium">
                  Your Wallet Balance
                </label>
                <div className="bg-gray-100 rounded-md px-3 py-2 mt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Available Balance:</span>
                    <span
                      className={`font-medium ${
                        canAfford ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ₦
                      {new Intl.NumberFormat('en-NG').format(
                        user.wallet_balance
                      )}
                    </span>
                  </div>
                  {!canAfford && (
                    <div className="text-red-600 text-xs mt-1">
                      Insufficient balance. You need ₦
                      {new Intl.NumberFormat('en-NG').format(
                        total - user.wallet_balance
                      )}{' '}
                      more.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Location */}
            <Input
              name="delivery_location"
              label="Delivery Location"
              placeholder="Enter your delivery address"
              required
            />

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium">
                Payment Method
              </label>
              <select
                name="payment_method"
                className="mt-1 w-full border rounded-md px-3 py-2"
                value={values.payment_method}
                onChange={(e) =>
                  setFieldValue('payment_method', e.target.value)
                }
              >
                <option value="">Select payment method</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                processing || (values.payment_method === 'wallet' && !canAfford)
              }
            >
              {processing
                ? 'Processing Payment...'
                : values.payment_method === 'wallet' && !canAfford
                ? 'Insufficient Wallet Balance'
                : 'Proceed to Pay'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
