'use client';

import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

const parseNairaInput = (formatted: string): number =>
  parseFloat((formatted || '').replace(/,/g, '')) || 0;

// ✅ Validate the formatted string by parsing it
const NegotiationSchema = Yup.object().shape({
  counterAmount: Yup.string()
    .required('Counter amount is required')
    .test(
      'valid-amount',
      'Enter a valid amount',
      (v) => parseNairaInput(v || '') >= 1
    ),
  message: Yup.string().optional(),
});

interface NegotiateModalProps {
  onClose: () => void;
  onSuccess: () => void;
  amountReceived: number;
  requestId: string;
}

export default function NegotiateModal({
  onClose,
  onSuccess,
  amountReceived,
  requestId,
}: NegotiateModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100001]"
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

        <h2 className="text-lg font-semibold mb-4">Negotiate Amount</h2>

        <Formik
          initialValues={{ counterAmount: '', message: '' }}
          validationSchema={NegotiationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const payload = {
                counter_amount: parseNairaInput(values.counterAmount),
                additional_message: values.message || undefined,
              };

              const res = await axiosInstance.patch(
                `/quote-requests/negotiate/${requestId}`,
                payload
              );

              toast.success(
                res.data.message || 'Negotiation submitted successfully'
              );
              onClose();
              onSuccess();
            } catch (error) {
              const axiosError = error as AxiosError<{ message?: string }>;
              toast.error(
                (
                  axiosError.response?.data?.message ||
                  axiosError.message ||
                  'An error occurred'
                ).toString()
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Amount Received (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Received
                </label>
                <input
                  type="text"
                  value={`₦${new Intl.NumberFormat('en-NG').format(
                    amountReceived
                  )}`}
                  readOnly
                  className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Counter Amount (formatted) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Counter Amount *
                </label>
                <Field name="counterAmount">
                  {({ field, form }: FieldProps) => (
                    <input
                      {...field}
                      type="text"
                      inputMode="numeric"
                      placeholder="₦ Input amount"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-mikado focus:ring-1 focus:ring-mikado"
                      onChange={(e) => {
                        const raw = e.target.value;
                        form.setFieldValue(field.name, formatNairaInput(raw));
                      }}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="counterAmount"
                  component="div"
                  className="mt-1 text-xs text-red-600"
                />
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Message (optional)
                </label>
                <Field
                  as="textarea"
                  name="message"
                  placeholder="Input additional message"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-mikado focus:ring-1 focus:ring-mikado"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="secondary" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting…' : 'Submit'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

/* currency helpers */
const formatNairaInput = (value: string): string => {
  const numericValue = (value || '').replace(/[^\d.]/g, '');
  const parts = numericValue.split('.');
  if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
  if (parts[0]) {
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts[1] !== undefined ? `${integerPart}.${parts[1]}` : integerPart;
  }
  return numericValue;
};
