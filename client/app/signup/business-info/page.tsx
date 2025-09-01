// app/auth/business-setup/page.tsx
'use client';

import React from 'react';
import {
  Formik,
  Form,
  Field,
  FieldProps,
  ErrorMessage,
  useFormikContext,
} from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle, Trash2 } from 'lucide-react';
import { Input } from '@/app/components/form/Input';
import { Button } from '@/app/components/ui/Button';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

// Form values interface
interface BusinessInfoValues {
  businessName: string;
  registrationNumber: string;
  cacFile: File | null;
  bankStatement: File | null;
  address: string;
  city: string;
  state: string;
  country: string;
}

// Validation schema
const validationSchema = Yup.object({
  businessName: Yup.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must not exceed 100 characters')
    .matches(
      /^[A-Za-z0-9\s\-&.()]+$/,
      'Business name contains invalid characters'
    )
    .required('Business name is required'),
  registrationNumber: Yup.string()
    .min(6, 'Registration number must be at least 6 characters')
    .max(20, 'Registration number must not exceed 20 characters')
    .matches(
      /^[A-Z0-9\-]+$/,
      'Registration number must contain only uppercase letters, numbers, and hyphens'
    )
    .required('Registration number is required'),
  cacFile: Yup.mixed().required('CAC Certificate is required'),
  bankStatement: Yup.mixed().required('Bank statement is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
});

const nigeriaStateOptions = [
  { value: '', label: 'Select state' },
  { value: 'Abia', label: 'Abia' },
  { value: 'Adamawa', label: 'Adamawa' },
  { value: 'Akwa Ibom', label: 'Akwa Ibom' },
  { value: 'Anambra', label: 'Anambra' },
  { value: 'Bauchi', label: 'Bauchi' },
  { value: 'Bayelsa', label: 'Bayelsa' },
  { value: 'Benue', label: 'Benue' },
  { value: 'Borno', label: 'Borno' },
  { value: 'Cross River', label: 'Cross River' },
  { value: 'Delta', label: 'Delta' },
  { value: 'Ebonyi', label: 'Ebonyi' },
  { value: 'Edo', label: 'Edo' },
  { value: 'Ekiti', label: 'Ekiti' },
  { value: 'Enugu', label: 'Enugu' },
  { value: 'FCT', label: 'Federal Capital Territory' },
  { value: 'Gombe', label: 'Gombe' },
  { value: 'Imo', label: 'Imo' },
  { value: 'Jigawa', label: 'Jigawa' },
  { value: 'Kaduna', label: 'Kaduna' },
  { value: 'Kano', label: 'Kano' },
  { value: 'Katsina', label: 'Katsina' },
  { value: 'Kebbi', label: 'Kebbi' },
  { value: 'Kogi', label: 'Kogi' },
  { value: 'Kwara', label: 'Kwara' },
  { value: 'Lagos', label: 'Lagos' },
  { value: 'Nasarawa', label: 'Nasarawa' },
  { value: 'Niger', label: 'Niger' },
  { value: 'Ogun', label: 'Ogun' },
  { value: 'Ondo', label: 'Ondo' },
  { value: 'Osun', label: 'Osun' },
  { value: 'Oyo', label: 'Oyo' },
  { value: 'Plateau', label: 'Plateau' },
  { value: 'Rivers', label: 'Rivers' },
  { value: 'Sokoto', label: 'Sokoto' },
  { value: 'Taraba', label: 'Taraba' },
  { value: 'Yobe', label: 'Yobe' },
  { value: 'Zamfara', label: 'Zamfara' },
];

const ghanaStateOptions = [
  { value: '', label: 'Select region' },
  { value: 'Ashanti', label: 'Ashanti' },
  { value: 'Brong-Ahafo', label: 'Brong-Ahafo' },
  { value: 'Central', label: 'Central' },
  { value: 'Eastern', label: 'Eastern' },
  { value: 'Greater Accra', label: 'Greater Accra' },
  { value: 'Northern', label: 'Northern' },
  { value: 'Upper East', label: 'Upper East' },
  { value: 'Upper West', label: 'Upper West' },
  { value: 'Volta', label: 'Volta' },
  { value: 'Western', label: 'Western' },
];

// Function to get state options based on country
const getStateOptions = (country: string) => {
  switch (country) {
    case 'Nigeria':
      return nigeriaStateOptions;
    case 'Ghana':
      return ghanaStateOptions;
    default:
      return [{ value: '', label: 'Select state' }];
  }
};

const countryOptions = [
  { value: '', label: 'Select country' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Ghana', label: 'Ghana' },
];

// Dropzone for CAC Certificate
function CacDropzone() {
  const { values, setFieldValue } = useFormikContext<BusinessInfoValues>();
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [], 'application/pdf': [] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: (files) => setFieldValue('cacFile', files[0]),
  });
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        CAC Certificate <span className="text-red-500">*</span>
      </label>
      {values.cacFile ? (
        <div className="mt-1 border border-dashed border-[#DCDCDC] rounded-md p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="bg-[#E7F6EC] p-3 rounded-full">
              <CheckCircle className="text-green-500" size={24} />
            </span>
            <div className="ml-2">
              <p className="font-medium text-black capitalize">
                {values.cacFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(values.cacFile.lastModified).toLocaleDateString()} •{' '}
                {(values.cacFile.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          </div>
          <button type="button" onClick={() => setFieldValue('cacFile', null)}>
            <Trash2 className="text-red-500" size={24} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="mt-1 border-dashed border-[1.5px] border-[#DCDCDC] rounded-md p-6 flex gap-4 items-center justify-start cursor-pointer"
        >
          <input {...getInputProps()} />
          <span className="bg-[#F0F2F5] p-3 rounded-full">
            <UploadCloud className="text-[#797979]" size={32} />
          </span>
          <span className="flex flex-col items-start">
            <span className="mt-2 text-[#E2A109] underline font-medium">
              Upload
            </span>
            <span className="text-sm text-gray-500 mt-1">
              .jpg .png .pdf • Max. 5MB
            </span>
          </span>
        </div>
      )}
      <ErrorMessage
        name="cacFile"
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
}

// Dropzone for Bank Statement
function BankDropzone() {
  const { values, setFieldValue } = useFormikContext<BusinessInfoValues>();
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [], 'application/pdf': [] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: (files) => setFieldValue('bankStatement', files[0]),
  });
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Upload your Business Bank Statement (last 6 months){' '}
        <span className="text-red-500">*</span>
      </label>
      {values.bankStatement ? (
        <div className="mt-1 border border-dashed border-[#DCDCDC] rounded-md p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="bg-[#E7F6EC] p-3 rounded-full">
              <CheckCircle className="text-green-500" size={24} />
            </span>
            <div className="ml-2">
              <p className="font-medium text-black capitalize">
                {values.bankStatement.name}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(
                  values.bankStatement.lastModified
                ).toLocaleDateString()}{' '}
                • {(values.bankStatement.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFieldValue('bankStatement', null)}
          >
            <Trash2 className="text-red-500" size={24} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="mt-1 border-dashed border-[1.5px] border-[#DCDCDC] rounded-md p-6 flex gap-4 items-center justify-start cursor-pointer"
        >
          <input {...getInputProps()} />
          <span className="bg-[#F0F2F5] p-3 rounded-full">
            <UploadCloud className="text-[#797979]" size={32} />
          </span>
          <span className="flex flex-col items-start">
            <span className="mt-2 text-[#E2A109] underline font-medium">
              Upload
            </span>
            <span className="text-sm text-gray-500 mt-1">
              .jpg .png .pdf • Max. 5MB
            </span>
          </span>
        </div>
      )}
      <ErrorMessage
        name="bankStatement"
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
}

// Main form component
export default function BusinessInfoForm() {
  const initialValues: BusinessInfoValues = {
    businessName: '',
    registrationNumber: '',
    cacFile: null,
    bankStatement: null,
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
  };

  const router = useRouter();

  const onSubmit = async (values: BusinessInfoValues) => {
    const formData = new FormData();
    formData.append('business_name', values.businessName);
    formData.append('reg_number', values.registrationNumber);
    formData.append('business_address', values.address);
    formData.append('city', values.city);
    formData.append('state', values.state);
    formData.append('country', values.country);
    if (values.cacFile) {
      formData.append('cac_certificate', values.cacFile);
    }
    if (values.bankStatement) {
      formData.append('bank_statement', values.bankStatement);
    }

    try {
      const resp = await axiosInstance.post('/auth/business-setup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(resp.data.message || 'Business info submitted');
      router.push('/signup/verification');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'An error occurred';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mt-12 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[624px] ">
        <h1 className="text-2xl md:text-[34px] font-semibold text-raisin text-center">
          Business Information
        </h1>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Tell us about your business to complete your account set up
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="mt-6 space-y-6">
            {/* Business Name & Registration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                {' '}
                <Field name="businessName">
                  {({ field, meta }: FieldProps) => (
                    <>
                      <Input
                        size="lg"
                        label="Business Name *"
                        variant="outline"
                        {...field}
                        placeholder="e.g AB distributor"
                        hasError={meta.touched && !!meta.error}
                        maxLength={100}
                      />
                      <ErrorMessage
                        name="businessName"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </>
                  )}
                </Field>
              </div>
              <div>
                {' '}
                <Field name="registrationNumber">
                  {({ field, meta }: FieldProps) => (
                    <>
                      <Input
                        label="Registration Number *"
                        variant="outline"
                        {...field}
                        placeholder="e.g RC123456"
                        hasError={meta.touched && !!meta.error}
                        size="lg"
                        maxLength={20}
                        onChange={(e) => {
                          // Convert to uppercase and allow only letters, numbers, and hyphens
                          const value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9\-]/g, '');
                          field.onChange({
                            target: { name: field.name, value },
                          });
                        }}
                      />
                      <ErrorMessage
                        name="registrationNumber"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </>
                  )}
                </Field>
              </div>
            </div>

            {/* CAC Certificate Upload */}
            <CacDropzone />

            {/* Bank Statement Upload */}
            <BankDropzone />

            {/* Address */}
            <Field name="address">
              {({ field, meta }: FieldProps) => (
                <>
                  <Input
                    label="Address *"
                    variant="outline"
                    {...field}
                    placeholder="Enter address"
                    hasError={meta.touched && !!meta.error}
                    size="lg"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </>
              )}
            </Field>

            {/* City, State, Country */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Field name="city">
                  {({ field, meta }: FieldProps) => (
                    <>
                      <Input
                        label="City *"
                        variant="outline"
                        {...field}
                        placeholder="Enter city"
                        hasError={meta.touched && !!meta.error}
                        size="lg"
                      />
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </>
                  )}
                </Field>
              </div>

              {/* State */}
              <div>
                <Field name="state">
                  {({ field, meta, form }: FieldProps) => {
                    const stateOptions = getStateOptions(form.values.country);
                    return (
                      <>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-raisin"
                        >
                          State *
                        </label>
                        <select
                          {...field}
                          id="state"
                          className={`w-full mt-1 px-4 py-3 border rounded-md text-sm md:text-base lg:text-lg text-raisin ${
                            meta.touched && meta.error
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-mikado`}
                        >
                          {stateOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </>
                    );
                  }}
                </Field>
              </div>

              {/* Country */}
              <div>
                <Field name="country">
                  {({ field, meta, form }: FieldProps) => (
                    <>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-raisin"
                      >
                        Country *
                      </label>
                      <select
                        {...field}
                        id="country"
                        className={`w-full mt-1 px-4 py-3 border rounded-md text-sm md:text-base lg:text-lg text-raisin ${
                          meta.touched && meta.error
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-mikado`}
                        onChange={(e) => {
                          field.onChange(e);
                          // Reset state when country changes
                          form.setFieldValue('state', '');
                        }}
                      >
                        {countryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ErrorMessage
                        name="country"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </>
                  )}
                </Field>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="default" className="w-full">
                Submit
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
