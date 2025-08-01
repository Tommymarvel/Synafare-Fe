'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/form/Input';
import { toast } from 'react-toastify';

interface ForgotValues {
  email: string;
}

const ForgotPasswordSchema = Yup.object<ForgotValues>({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export default function ForgotPasswordPage() {
  // const router = useRouter();

  const handleSubmit = async (
    values: ForgotValues,
    { setSubmitting, setErrors }: FormikHelpers<ForgotValues>
  ) => {
    setSubmitting(true);
    try {
      // Send the reset email with a link back to your “new-password” page
      await sendPasswordResetEmail(auth, values.email, {
        url: `${window.location.origin}/forgot-password/new-password`,
        handleCodeInApp: true,
      });

      toast.success('Password reset email sent! Check your inbox.');
      // Optionally clear the form or redirect:
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to send reset email';
      toast.error(message);
      setErrors({ email: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-[624px] space-y-6">
          <h1 className="text-2xl md:text-[34px] font-medium text-raisin text-center">
            Forgot Password
          </h1>
          <p className="text-sm text-[#645D5D] text-center">
            Enter your registered email address to reset your password
          </p>

          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="space-y-4">
                <Field name="email">
                  {({
                    field,
                    meta,
                  }: {
                    field: React.InputHTMLAttributes<HTMLInputElement>;
                    meta: { touched: boolean; error?: string };
                  }) => (
                    <>
                      <Input
                        label="Email Address"
                        variant="outline"
                        type="email"
                        placeholder="you@email.com"
                        {...field}
                        hasError={meta.touched && !!meta.error}
                        size="lg"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                        aria-live="polite"
                      />
                    </>
                  )}
                </Field>

                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Reset Password'}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm underline font-semibold text-raisin"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
