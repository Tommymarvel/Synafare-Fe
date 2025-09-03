'use client';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/app/components/ui/Button';
import { X } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

const QuoteSchema = Yup.object().shape({
  delivery_location: Yup.string().required('Delivery location is required'),
  additional_message: Yup.string().optional(),
});

interface RequestQuoteModalSimpleProps {
  supplierId: string;
  onClose: () => void;
  onSuccess?: (supplierId: string) => void;
  supplierName?: string;
}

export default function RequestQuoteModalSimple({
  supplierId,
  onClose,
  onSuccess,
  supplierName,
}: RequestQuoteModalSimpleProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-lg">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-2 text-raisin">Request Quote</h2>
        {supplierName && (
          <p className="text-sm text-gray-600 mb-4">From: {supplierName}</p>
        )}

        <Formik
          initialValues={{ delivery_location: '', additional_message: '' }}
          validationSchema={QuoteSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await axiosInstance.post(
                `/quote-requests/from-cart/${supplierId}`,
                {
                  delivery_location: values.delivery_location,
                  additional_information:
                    values.additional_message || undefined,
                }
              );
              toast.success('Request sent successfully');
              onSuccess?.(supplierId);
              onClose(); // close only on success
            } catch (error) {
              const axiosError = error as AxiosError<{ message?: string }>;
              toast.error(
                (
                  axiosError.response?.data?.message ??
                  axiosError.message ??
                  'An error occurred'
                ).toString()
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="space-y-4">
              {/* Delivery Location */}
              <div className="space-y-1">
                <label
                  htmlFor="delivery_location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Delivery Location
                </label>
                <Field
                  id="delivery_location"
                  name="delivery_location"
                  type="text"
                  placeholder="Enter your delivery address"
                  className={`w-full rounded-md border p-4 placeholder:text-[#98A2B3] focus:border-mikado focus:ring-2 focus:ring-mikado focus:outline-none text-raisin transition ${
                    touched.delivery_location && errors.delivery_location
                      ? 'border-red-500'
                      : 'border-[#D0D5DD]'
                  }`}
                  aria-invalid={
                    touched.delivery_location && errors.delivery_location
                      ? 'true'
                      : undefined
                  }
                  aria-describedby={
                    touched.delivery_location && errors.delivery_location
                      ? 'delivery_location-error'
                      : undefined
                  }
                />
                {touched.delivery_location && errors.delivery_location ? (
                  <p
                    id="delivery_location-error"
                    className="text-sm text-red-600"
                  >
                    {errors.delivery_location}
                  </p>
                ) : null}
              </div>

              {/* Additional Message */}
              <div className="space-y-1">
                <label
                  htmlFor="additional_message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Additional Message (optional)
                </label>
                <Field
                  as="textarea"
                  id="additional_message"
                  name="additional_message"
                  rows={3}
                  placeholder="Describe your requirements..."
                  className="w-full rounded-md border border-[#D0D5DD] p-4 placeholder:text-[#98A2B3] focus:border-mikado focus:ring-2 focus:ring-mikado focus:outline-none text-raisin transition"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="secondary" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
