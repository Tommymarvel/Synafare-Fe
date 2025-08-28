'use client';
import React from 'react';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/app/components/form/Input';
import { Button } from '@/app/components/ui/Button';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

interface AccountSetupValues {
  first_name: string;
  last_name: string;
  phn_no: string;
  nature_of_solar_business: string;
  id_type: string;
  id_number: string;
  bvn: string;
}

/** You can keep Yup as a safety net, but UI enforces correctness already */
const validationSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  phn_no: Yup.string().required('Phone number is required'),
  nature_of_solar_business: Yup.string().required('Primary nature is required'),
  id_type: Yup.string().required('ID type is required'),
  id_number: Yup.string().required('ID number is required'),
  bvn: Yup.string().required('BVN is required'),
});

const idOptions = [
  { value: '', label: 'Select ID Type' },
  { value: 'vin', label: "Voter's ID" },
  { value: 'dl', label: 'Driver License' },
  { value: 'nin', label: 'National ID' },
];

const businessOptions = [
  { value: '', label: 'Select nature of business' },
  { value: 'installer', label: 'Installer' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'supplier', label: 'Supplier' },
];

export default function Onboarding() {
  const initialValues: AccountSetupValues = {
    first_name: '',
    last_name: '',
    phn_no: '',
    nature_of_solar_business: '',
    id_type: '',
    id_number: '',
    bvn: '',
  };

  const router = useRouter();

  const onSubmit = async (values: AccountSetupValues) => {
    try {
      const response = await axiosInstance.post('/auth/setup', values);
      toast.success(response.data.message || 'Account created successfully');
      router.push('/signup/business-info');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'An error occurred';
      toast.error(errorMessage);
    }
  };

  const handleVerifyId = async (
    id_type: string,
    id_number: string,
    setFieldError: (field: string, message: string) => void
  ) => {
    if (!id_type || !id_number) return; // don't call if not ready
    try {
      await axiosInstance.get(
        `/idlookup/verify/?doctype=${id_type}&doc_number=${id_number}`
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setFieldError(
        'id_number',
        axiosError.response?.data?.message || 'ID verification failed'
      );
    }
  };

  const handleVerifyBvn = async (
    bvnNumber: string,
    setFieldError: (field: string, message: string) => void
  ) => {
    if (!bvnNumber || bvnNumber.length !== 11) return; // verify only when 11 digits present
    try {
      await axiosInstance.get(
        `/idlookup/verify/?doctype=bvn&doc_number=${bvnNumber}`
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setFieldError(
        'bvn',
        axiosError.response?.data?.message || 'BVN verification failed'
      );
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[624px]">
        <h1 className="text-2xl md:text-[34px] font-semibold text-raisin text-center">
          Let’s get started
        </h1>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Tell us about yourself to complete your account set up
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field name="first_name">
                    {({ field, meta }: FieldProps<string>) => (
                      <>
                        <Input
                          label="First Name *"
                          variant="outline"
                          {...field}
                          placeholder="e.g David"
                          hasError={meta.touched && !!meta.error}
                          size="lg"
                          className="text-raisin"
                          lettersOnly // ✅ block non-letters
                          maxLength={40}
                        />
                        <ErrorMessage
                          name="first_name"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </>
                    )}
                  </Field>
                </div>

                <div>
                  <Field name="last_name">
                    {({ field, meta }: FieldProps<string>) => (
                      <>
                        <Input
                          label="Last Name *"
                          variant="outline"
                          {...field}
                          placeholder="e.g Doe"
                          hasError={meta.touched && !!meta.error}
                          size="lg"
                          className="text-raisin"
                          lettersOnly // ✅ block non-letters
                          maxLength={40}
                        />
                        <ErrorMessage
                          name="last_name"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </>
                    )}
                  </Field>
                </div>
              </div>

              <Field name="phn_no">
                {({ field, meta }: FieldProps<string>) => (
                  <>
                    <Input
                      label="Phone Number *"
                      variant="outline"
                      {...field}
                      placeholder="+2348012345678"
                      hasError={meta.touched && !!meta.error}
                      size="lg"
                      className="text-raisin"
                      phoneMode // ✅ only digits, single leading '+'
                      maxLength={15}
                    />
                    <ErrorMessage
                      name="phn_no"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </>
                )}
              </Field>

              <div>
                <Field name="nature_of_solar_business">
                  {({ field, meta }: FieldProps<string>) => (
                    <>
                      <label
                        htmlFor="nature_of_solar_business"
                        className="block text-sm font-medium text-raisin"
                      >
                        What is the primary nature of your solar business? *
                      </label>
                      <select
                        {...field}
                        id="nature_of_solar_business"
                        className={`w-full mt-1 px-4 py-3 border rounded-md text-sm md:text-base lg:text-lg text-raisin ${
                          meta.touched && meta.error
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-mikado`}
                      >
                        {businessOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ErrorMessage
                        name="nature_of_solar_business"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </>
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Field name="id_type">
                    {({ field, meta }: FieldProps<string>) => (
                      <>
                        <label
                          htmlFor="id_type"
                          className="block text-sm font-medium text-raisin"
                        >
                          ID Type *
                        </label>
                        <select
                          {...field}
                          id="id_type"
                          className={`w-full mt-1 px-4 py-3 border rounded-md text-sm md:text-base lg:text-lg text-raisin ${
                            meta.touched && meta.error
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-mikado`}
                        >
                          {idOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ErrorMessage
                          name="id_type"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </>
                    )}
                  </Field>
                </div>

                <div>
                  <Field name="id_number">
                    {({ field, meta, form }: FieldProps<string>) => (
                      <>
                        <Input
                          label="ID Number *"
                          variant="outline"
                          {...field}
                          placeholder="Enter ID number"
                          hasError={meta.touched && !!meta.error}
                          size="lg"
                          className="text-raisin"
                          numericOnly // ✅ digits only
                          maxLength={20}
                          onBlur={(e) => {
                            field.onBlur(e);
                            // only verify if id_type chosen and there's some value
                            handleVerifyId(
                              (form.values as AccountSetupValues).id_type,
                              (form.values as AccountSetupValues).id_number,
                              form.setFieldError
                            );
                          }}
                        />
                        <ErrorMessage
                          name="id_number"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </>
                    )}
                  </Field>
                </div>
              </div>

              <Field name="bvn">
                {({ field, form }: FieldProps<string>) => (
                  <>
                    <Input
                      label="BVN *"
                      variant="outline"
                      numericOnly
                      size="lg"
                      maxLength={11}
                      {...field}
                      onBlur={(e) => {
                        field.onBlur(e);
                        handleVerifyBvn(form.values.bvn, form.setFieldError);
                      }}
                    />

                    <ErrorMessage
                      name="bvn"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </>
                )}
              </Field>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Next'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
