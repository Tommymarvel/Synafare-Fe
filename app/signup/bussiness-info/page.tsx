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
  businessName: Yup.string().required('Business name is required'),
  registrationNumber: Yup.string().required('Registration number is required'),
  cacFile: Yup.mixed().required('CAC Certificate is required'),
  bankStatement: Yup.mixed().required('Bank statement is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
});

// Dropzone for CAC Certificate (must be a standalone component)
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

  const onSubmit = (values: BusinessInfoValues) => {
    console.log('Submitted values:', values);
  };

  return (
    <div className=" mt-12 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[624px] ">
        <h1 className="text-2xl m md:text-[34px] font-semibold text-raisin text-center">
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
                    />
                    <ErrorMessage
                      name="businessName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </>
                )}
              </Field>
              <Field name="registrationNumber">
                {({ field, meta }: FieldProps) => (
                  <>
                    <Input
                      label="Registration Number *"
                      variant="outline"
                      {...field}
                      placeholder="Enter number"
                      hasError={meta.touched && !!meta.error}
                      size="lg"
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
                    size='lg'
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
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="city"
                  className="mt-1 w-full border border-[#DCDCDC] rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-mikado text-raisin"
                >
                  <option value="">Select city</option>
                </Field>
                <ErrorMessage
                  name="city"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="state"
                  className="mt-1 w-full border border-[#DCDCDC] rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-mikado text-raisin"
                >
                  <option value="">Select state</option>
                </Field>
                <ErrorMessage
                  name="state"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="country"
                  className="mt-1 w-full border border-[#DCDCDC] rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-mikado text-raisin"
                >
                  <option value="Nigeria">Nigeria</option>
                </Field>
                <ErrorMessage
                  name="country"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
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
