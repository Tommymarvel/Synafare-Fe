'use client';

import { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { X, ChevronDown, UploadCloud } from 'lucide-react';
import { Input } from '@/app/components/form/Input';
import { Button } from '@/app/components/ui/Button';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export type BusinessFormValues = {
  businessId: string;
  businessName: string;
  rcNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  logoFile: File | null;
  logoPreview: string; // URL for preview
};

const Schema = Yup.object({
  businessName: Yup.string().trim().required('Business name is required'),
  rcNumber: Yup.string().trim().required('Registration number is required'),
  address: Yup.string().trim().required('Address is required'),
  city: Yup.string().trim().required('City is required'),
  state: Yup.string().trim().required('State is required'),
  country: Yup.string().trim().required('Country is required'),
});

export default function EditBusinessModal({
  open,
  onClose,
  initialValues,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  initialValues: BusinessFormValues;
  onSuccess: (patch: Partial<BusinessFormValues>) => void;
}) {
  // backdrop/esc UX
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute inset-0 grid place-items-center px-3">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl" role="dialog" aria-modal="true">
          {/* Header */}
          <div className="relative border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold">Edit Business Information</h2>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <Formik<BusinessFormValues>
            initialValues={initialValues}
            validationSchema={Schema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const formData = new FormData();
                if (values.logoFile) formData.append('business-logo', values.logoFile);
                formData.append('business_name', values.businessName);
                formData.append('reg_number', values.rcNumber);
                formData.append('business_address', values.address);
                formData.append('city', values.city);
                formData.append('state', values.state);
                formData.append('country', values.country);

                await axiosInstance.patch(
                  `/auth/edit-business/${values.businessId}`,
                  formData,
                  { headers: { 'Content-Type': 'multipart/form-data' } }
                );

                toast.success('Business information updated');
                onSuccess({
                  businessName: values.businessName,
                  rcNumber: values.rcNumber,
                  address: values.address,
                  city: values.city,
                  state: values.state,
                  country: values.country,
                  logoPreview: values.logoPreview,
                });
              } catch (error) {
                    const axiosError = error as AxiosError<{ message?: string }>;
                    toast.error(
                      (axiosError.response && axiosError.response.data
                        ? axiosError.response.data.message || axiosError.response.data
                        : axiosError.message || 'An error occurred'
                      ).toString()
                    );
                  } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, isSubmitting, setFieldValue, errors, touched }) => (
              <Form className="px-6 py-5 space-y-4">
                {/* Logo uploader */}
                <div>
                  <label className="mb-1 block text-sm font-medium">Business Logo</label>

                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        setFieldValue('logoFile', file);
                        setFieldValue('logoPreview', URL.createObjectURL(file));
                      }
                    }}
                    className={`flex h-28 w-full items-center justify-center rounded-xl border-2 border-dashed ${
                      dragging ? 'border-mikado bg-yellow-50/40' : 'border-gray-200'
                    }`}
                  >
                    {values.logoPreview ? (
                      <div className="relative h-20 w-40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={values.logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
                      </div>
                    ) : (
                      <div className="text-center text-xs text-gray-500">
                        <UploadCloud className="mx-auto mb-1 h-5 w-5 text-gray-400" />
                        Drag and drop your Logo here or{' '}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="font-medium text-gray-700 underline underline-offset-2"
                        >
                          Browse
                        </button>{' '}
                        to upload
                        <div className="mt-1 text-[10px] text-gray-400">Supported file types : .jpg, .png</div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFieldValue('logoFile', file);
                        setFieldValue('logoPreview', file ? URL.createObjectURL(file) : '');
                      }}
                    />
                  </div>
                </div>

                {/* Fields grid */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Business Name *</label>
                    <Field as={Input} name="businessName" placeholder="Business name" />
                    {touched.businessName && errors.businessName && (
                      <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Registration Number *</label>
                    <Field as={Input} name="rcNumber" placeholder="RC1234567" />
                    {touched.rcNumber && errors.rcNumber && (
                      <p className="mt-1 text-xs text-red-600">{errors.rcNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Address *</label>
                    <Field as={Input} name="address" placeholder="15 Brook Street, Lekki, Lagos" />
                    {touched.address && errors.address && (
                      <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SelectField
                      label="City *"
                      name="city"
                      value={values.city}
                      options={['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan']}
                      onChange={(v) => setFieldValue('city', v)}
                      error={touched.city && (errors.city as string)}
                    />
                    <SelectField
                      label="State *"
                      name="state"
                      value={values.state}
                      options={['Lagos', 'FCT', 'Rivers', 'Oyo']}
                      onChange={(v) => setFieldValue('state', v)}
                      error={touched.state && (errors.state as string)}
                    />
                    <SelectField
                      label="Country *"
                      name="country"
                      value={values.country}
                      options={['Nigeria', 'Ghana', 'Benin', 'United Kingdom']}
                      onChange={(v) => setFieldValue('country', v)}
                      error={touched.country && (errors.country as string)}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

/* ---------------- small helpers ---------------- */

function SelectField({
  label,
  name,
  value,
  options,
  onChange,
  error,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  error?: string | false;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input w-full appearance-none pr-8"
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
