'use client';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { X, Upload, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/form/Input';
import axiosInstance from '@/lib/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SetupInvoiceModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setLogoFile(acceptedFiles[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error('File size must be less than 5MB');
      } else if (error?.code === 'file-invalid-type') {
        toast.error('Only image files are allowed (JPG, PNG, GIF, WebP)');
      } else {
        toast.error('Invalid file. Please try again.');
      }
    },
  });

  const handleRemoveFile = () => {
    setLogoFile(null);
  };

  const validationSchema = Yup.object({
    businessName: Yup.string().required('Business name is required'),
    rcNumber: Yup.string().required('RC number is required'),
    address: Yup.string().required('Business address is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
  });

  return (
    <div className="fixed inset-0 z-[100000]" aria-hidden={false}>
      <div
        className="fixed inset-0 bg-black/50 z-[99999] pointer-events-auto"
        onClick={onClose}
      />
       <div className="fixed inset-0 flex items-start justify-center px-3 pt-20 z-[100000]"><div className="w-full max-w-2xl rounded-2xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold">Set up Invoice</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <Formik
          initialValues={{
            businessName: user?.business?.business_name || '',
            rcNumber: user?.business?.reg_number || '',
            address: user?.business?.business_address || '',
            phoneCode: '+234',
            phoneNumber: user?.phn_no?.replace('+234', '') || '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            if (!logoFile) {
              toast.error('Please select a business logo');
              return;
            }

            setIsUploading(true);
            setSubmitting(true);

            try {
              const formData = new FormData();
              formData.append('business-logo', logoFile);
              formData.append('business_name', values.businessName);
              formData.append('reg_number', values.rcNumber);
              formData.append('business_address', values.address);

              // Upload logo and update business information in single API call
              await axiosInstance.patch(
                `/auth/edit-business/${user?.business?._id}`,
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                }
              );

              toast.success('Business setup completed successfully!');
              await refreshUser(); // Refresh user data to get updated business info

              // Navigate to create invoice
              router.push('/dashboard/invoices/create');
              onClose();
            } catch (error: unknown) {
              console.error('Error setting up business:', error);

              let errorMessage = 'Failed to setup business. Please try again.';
              if (error instanceof Error) {
                errorMessage = error.message;
              } else if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error
              ) {
                const axiosError = error as {
                  response?: { data?: { message?: string } };
                };
                errorMessage =
                  axiosError.response?.data?.message || errorMessage;
              }

              toast.error(errorMessage);
            } finally {
              setIsUploading(false);
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="space-y-5 px-6 py-5">
              {/* Business Logo */}
              <div className=" flex flex-col lg:flex-row items-start space-y-5 justify-between gap-6">
                {' '}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Business Logo <span className="text-red-500">*</span>
                  </label>

                  {logoFile ? (
                    // File selected state
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {logoFile.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(logoFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          disabled={isUploading}
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Upload dropzone
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragActive
                          ? 'border-mikado bg-mikado/5'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="space-y-3">
                        <div className="bg-gray-100 p-3 rounded-full inline-block">
                          <Upload className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {isDragActive
                              ? 'Drop your logo here'
                              : 'Upload business logo'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, GIF, WebP • Max 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-5">
                  {/* Business Name */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Business Name *
                    </label>
                    <Field as={Input} name="businessName" />
                  </div>

                  {/* RC Number */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      RC Number *
                    </label>
                    <Field as={Input} name="rcNumber" />
                  </div>

                  {/* Business Address */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Business Address *
                    </label>
                    <Field as={Input} name="address" />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Phone Number *
                    </label>
                    <div className="flex gap-2">
                      <Field
                        as="select"
                        name="phoneCode"
                        className="border rounded-lg p-2 max-w-1/6"
                      >
                        <option value="+234">+234</option>
                        <option value="+233">+233</option>
                      </Field>
                      <Field as={Input} name="phoneNumber" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isUploading}
                >
                  Cancel{' '}
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting || isUploading || !logoFile || !isValid
                  }
                >
                  {isUploading ? 'Setting up...' : 'Continue'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div></div>
      
    </div>
  );
}
