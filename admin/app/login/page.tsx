'use client';

import Image from 'next/image';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { LoginValues, useLoginFlow } from '@/hooks/useLoginFLow';


// If you have project components, uncomment these lines and swap below:
// import { Input } from '@/app/components/form/Input';
// import { Button } from '@/app/components/ui/Button';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required'),
});

const initialValues: LoginValues = { email: '', password: '' };

export default function LoginPage() {
  const { login, submitting } = useLoginFlow();

  return (
    <div className="h-screen flex items-center justify-center bg-[#F8F8F8]">
      <div className="shadow-custom py-8 px-6 md:px-16 space-y-[22px] bg-white rounded-xl w-full max-w-xl">
        <Image
          src="/synafare-yellow.svg"
          alt="Logo"
          width={94}
          height={59}
          className="mx-auto"
          priority
        />

        <div className="space-y-2 text-center">
          <h1 className="text-[28px] md:text-[34px] font-medium text-resin-black">
            Welcome to Synafare-Admin
          </h1>
          <p className="text-brown-700 text-sm">
            Provide your information to Login
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await login(values);
          }}
        >
          {({ isSubmitting, getFieldProps }) => (
            <Form className="space-y-6">
              {/* Email */}
              <div className="space-y-1">
                <label
                  className="font-medium block text-sm text-resin-black"
                  htmlFor="email"
                >
                  Email Address
                </label>

                {/* If you have a custom <Input>, swap this block for it and spread {...getFieldProps('email')} */}
                <input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  className="border-gray-300 block w-full border p-4 rounded-[6px] placeholder:text-gray-400 placeholder:text-[14px]"
                  {...getFieldProps('email')}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-600 text-xs mt-1"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label
                  className="font-medium block text-sm text-resin-black"
                  htmlFor="password"
                >
                  Password
                </label>

                {/* If you have a custom password <Input> with eye-toggle, swap this for it */}
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="border-gray-300 block w-full border p-4 rounded-[6px] placeholder:text-gray-400 placeholder:text-[14px]"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-600 text-xs mt-1"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || isSubmitting}
                className="bg-mikado-yellow rounded-lg block py-4 w-full text-center cursor-pointer text-resin-black font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting || isSubmitting ? 'Logging in…' : 'Login'}
              </button>

         
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
