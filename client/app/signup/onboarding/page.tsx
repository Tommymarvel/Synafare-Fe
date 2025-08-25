'use client';
import React from 'react';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/app/components/form/Input';
import { Button } from '@/app/components/ui/Button';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { CustomSelect, Option } from '@/app/components/form/CustomSelect';
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

const phoneRegex = /^\+?[0-9\s]{7,15}$/;

const validationSchema = Yup.object({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  phn_no: Yup.string()
    .matches(phoneRegex, 'Invalid phone number')
    .required('Phone number is required'),
  nature_of_solar_business: Yup.string().required('Primary nature is required'),
  id_type: Yup.string().required('ID type is required'),
  id_number: Yup.string().required('ID number is required'),
  bvn: Yup.string()
    .matches(/^\d{11}$/, 'BVN must be exactly 11 digits')
    .required('BVN is required'),
});

const idOptions: Option[] = [
  { value: '', label: 'Select ID Type' },
  { value: 'vin', label: "Voter's ID" },
  { value: 'dl', label: 'Driver License' },
  { value: 'nin', label: 'National ID' },
];

const businessOptions: Option[] = [
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

  const router = useRouter()

  const onSubmit = async (values: AccountSetupValues) => {
    try {
      const response = await axiosInstance.post('/auth/setup', values);
      toast.success(response.data.message || 'Account created successfully');
      router.push('/signup/business-info');
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

  const handleVerifyId = async (
    id_type: string,
    id_number: string,
    setFieldError: (field: string, message: string) => void
  ) => {
    try {
      await axiosInstance.get(
        `/idlookup/verify/?doctype=${id_type}&doc_number=${id_number}`
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      setFieldError(
        'id_number',
        axiosError.response?.data.message || 'ID verification failed'
      );
    }
  };

  const handleVerifyBvn = async (
    bvnNumber: string,
    setFieldError: (field: string, message: string) => void
  ) => {
    try {
      await axiosInstance.get(
        `/idlookup/verify/?doctype=bvn&doc_number=${bvnNumber}`
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      setFieldError(
        'bvn',
        axiosError.response?.data.message || 'ID verification failed'
      );
    }
  };

  return (
    <div className=" flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[624px] ">
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
                  <Field name="first_name" className="flex flex-col">
                    {({ field, meta }: FieldProps) => (
                      <>
                        <Input
                          label="First Name *"
                          variant="outline"
                          {...field}
                          placeholder="e.g David"
                          hasError={meta.touched && !!meta.error}
                          size="lg"
                          className="text-raisin"
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
                    {({ field, meta }: FieldProps) => (
                      <>
                        <Input
                          label="Last Name *"
                          variant="outline"
                          {...field}
                          placeholder="e.g Doe"
                          hasError={meta.touched && !!meta.error}
                          size="lg"
                          className="text-raisin"
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
                {({ field, meta }: FieldProps) => (
                  <>
                    <Input
                      label="Phone Number *"
                      variant="outline"
                      {...field}
                      placeholder="+123 456 7890"
                      hasError={meta.touched && !!meta.error}
                      size="lg"
                      className="text-raisin"
                      type='tel'
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
                <CustomSelect
                  name="nature_of_solar_business"
                  label=" What is the primary nature of your solar business?"
                  options={businessOptions}
                  className="mb-4 text-raisin"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CustomSelect
                  name="id_type"
                  label="ID Type"
                  options={idOptions}
                  className="mb-4 text-raisin"
                />
                <div>
                  <Field name="id_number">
                    {({
                      field,
                      meta,
                      form,
                    }: FieldProps & { form: FormData }) => (
                      <>
                        <Input
                          label="ID Number *"
                          variant="outline"
                          {...field}
                          placeholder="Enter ID number"
                          hasError={meta.touched && !!meta.error}
                          size="lg"
                          className="text-raisin"
                          onBlur={(e) => {
                            field.onBlur(e); // let Formik know we blurred
                            handleVerifyId(
                              form.values.id_type,
                              form.values.id_number,
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
                {({ field, meta, form }: FieldProps & { form: FormData }) => (
                  <>
                    <Input
                      label="BVN *"
                      variant="outline"
                      {...field}
                      placeholder="Enter your 11-digit BVN"
                      hasError={meta.touched && !!meta.error}
                      size="lg"
                      className="text-raisin"
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
                <Button type="submit" variant="default" className="w-full" disabled={isSubmitting}>
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
