'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
// import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/app/components/form/Input';
import { Button } from '@/app/components/ui/Button';

const ResetPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') || '';

  // top‐level hook state for each field
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (
    values: { newPassword: string; confirmPassword: string },
    { setSubmitting }: { setSubmitting: (b: boolean) => void }
  ) => {
    try {
      const res = await fetch(`/api/auth/reset-password?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: values.newPassword }),
      });
      if (!res.ok) throw new Error('Reset failed');
      router.push('/auth/login');
    } catch (err) {
      console.error(err);
      // optionally surface a form-level error
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <main className='w-full space-y-4 lg:space-y-8 max-w-[624px] mx-5 lg:mx-[64px] mb-[32px]'>
        <div className="w-full space-y-6">
          <div>
            {' '}
            <h1 className="text-2xl font-medium text-raisin text-center">
              New Password
            </h1>
            <p className="text-sm text-[#645D5D] text-center">
              Enter new password for your account
            </p>
          </div>

          <Formik
            initialValues={{ newPassword: '', confirmPassword: '' }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="space-y-4 w-full">
                {/* New Password */}
                <Field name="newPassword">
                  {({ field, meta }: FieldProps) => (
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNew ? 'text' : 'password'}
                        label="New Password"
                        variant="outline"
                        hasError={meta.touched && !!meta.error}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((s) => !s)}
                        className="absolute right-4 top-[68%] transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={showNew ? 'Hide password' : 'Show password'}
                      >
                        {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  )}
                </Field>

                {/* Confirm Password */}
                <Field name="confirmPassword">
                  {({ field, meta }: FieldProps) => (
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirm ? 'text' : 'password'}
                        label="Confirm Password"
                        variant="outline"
                        hasError={meta.touched && !!meta.error}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute right-4 top-[68%] transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={
                          showConfirm ? 'Hide password' : 'Show password'
                        }
                      >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  )}
                </Field>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={!isValid || isSubmitting}
                >
                  Update Password
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </main>
  );
}
