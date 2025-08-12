'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Input } from '@/app/components/form/Input';
import { Button } from '@/app/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ResetPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

interface ResetValues {
  newPassword: string;
  confirmPassword: string;
}

function getQueryParam(name: string, url: string) {
  try {
    return new URL(url).searchParams.get(name);
  } catch {
    return null;
  }
}

export default function ResetPasswordPage() {
  const router = useRouter();

  const [oobCode, setOobCode] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [codeValid, setCodeValid] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // extract params once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const href = window.location.href;
    setOobCode(getQueryParam('oobCode', href));
    setMode(getQueryParam('mode', href));
  }, []);

  // verify code
  useEffect(() => {
    if (mode !== 'resetPassword' || !oobCode) {
      setLinkError('Invalid password reset link.');
      setVerifying(false);
      setCodeValid(false);
      return;
    }

    (async () => {
      try {
        const emailFromCode = await verifyPasswordResetCode(auth, oobCode);
        setEmail(emailFromCode);
        setCodeValid(true);
      } catch (err) {
        console.error('verifyPasswordResetCode:', err);
        setLinkError('This password reset link is invalid or has expired.');
        setCodeValid(false);
      } finally {
        setVerifying(false);
      }
    })();
  }, [mode, oobCode]);

  const handleSubmit = async (values: ResetValues, helpers: FormikHelpers<ResetValues>) => {
    if (!oobCode) {
      toast.error('Missing or invalid reset code.');
      helpers.setSubmitting(false);
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, values.newPassword);
      toast.success('Password updated. You can now log in.');
      router.push('/login');
    } catch (err: unknown) {
      console.error('confirmPasswordReset error:', err);
      if (err instanceof Error) toast.error(err.message);
      else toast.error('Failed to reset password.');
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <main className="w-full max-w-[500px] mx-5 lg:mx-[64px] py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-medium text-raisin text-center">
            New Password
          </h1>
          <p className="text-sm text-[#645D5D] text-center">
            {verifying
              ? 'Verifying reset link...'
              : codeValid
              ? `Reset password for ${email}`
              : 'Cannot reset password.'}
          </p>
        </div>

        {verifying && (
          <div className="text-center text-sm text-gray-600">
            Please wait while we validate your link.
          </div>
        )}

        {!verifying && !codeValid && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            {linkError}{' '}
            <button
              onClick={() => router.push('/forgot-password')}
              className="underline font-semibold ml-1"
            >
              Request a new one
            </button>
          </div>
        )}

        {!verifying && codeValid && (
          <Formik
            initialValues={{ newPassword: '', confirmPassword: '' }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="space-y-4 w-full">
                <Field name="newPassword">
                  {({ field, meta }: FieldProps) => (
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNew ? 'text' : 'password'}
                        label="New Password"
                        variant="outline"
                        hasError={meta.touched && !!meta.error}
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((s) => !s)}
                        className="absolute right-4 top-[68%] transform -translate-y-1/2"
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

                <Field name="confirmPassword">
                  {({ field, meta }: FieldProps) => (
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirm ? 'text' : 'password'}
                        label="Confirm Password"
                        variant="outline"
                        hasError={meta.touched && !!meta.error}
                        placeholder="Re-enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute right-4 top-[68%] transform -translate-y-1/2"
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
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </main>
  );
}
