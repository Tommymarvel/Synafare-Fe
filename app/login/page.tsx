'use client';
import React, { useState } from 'react';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FieldProps,
} from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';

import { Input } from '../components/form/Input';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import axiosInstance from '@/lib/axiosInstance';
import Google from '@/app/assets/google-icon.png';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

interface LoginValues {
  email: string;
  password: string;
}

const LoginSchema = Yup.object<LoginValues>({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const handleSubmit = async (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>
  ) => {
    const { email, password } = values;
    setSubmitting(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const idToken = await cred.user.getIdToken();

      const { status, data } = await axiosInstance.post<{
        statusCode?: number;
      }>('/auth/login', { idToken });

      sessionStorage.setItem('verifyEmail', email);

      if (status === 204 || data.statusCode === 400) {
        router.push('/signup/verify-otp');
        return;
      }

      await refreshUser();

      // 6️⃣ Final redirect based on whether BVN is presen
      const nextRoute = user?.bvn == null ? '/signup/onboarding' : '/dashboard';

      router.push(nextRoute);
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
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const { status, data: { statusCode } } = await axiosInstance.post<{
        statusCode?: number;
      }>('/auth/login', { idToken });
      
      if (status === 204 || statusCode === 400) {
        sessionStorage.setItem('verifyEmail', result.user.email as string);
        router.push('/signup/verify-otp');
        return;
      }
      await refreshUser();
      const nextRoute = user?.bvn == null ? '/signup/onboarding' : '/dashboard';

      router.push(nextRoute);
    } catch (error: unknown) {
      let message = 'Google sign-in failed';
      if ((error as AxiosError).isAxiosError) {
        message = (error as AxiosError).message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    }
  };

  return (
    <div className="w-full space-y-4 lg:space-y-8 max-w-[500px] mx-5 lg:mx-[64px] mb-[32px]">
      <div>
        <h1 className="text-2xl lg:text-[34px] font-medium text-raisin text-center">
          Welcome Back
        </h1>
        <p className="text-sm text-[#645D5D] mt-2 text-center">
          Provide your correct details below to log in
        </p>
      </div>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-4 ">
            {/* Email */}
            <div>
              <Field name="email">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    label="Email Address"
                    variant="outline"
                    type="email"
                    placeholder="you@email.com"
                  />
                )}
              </Field>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Field name="password">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      label="Password"
                      variant="outline"
                      type={show ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pr-12"
                    />
                  )}
                </Field>
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-4 top-[68%] transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center text-sm">
                <input type="checkbox" className="h-4 w-4 rounded" />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-mikado">
                Forgot Password?
              </a>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Logging in…' : 'Login'}
            </Button>
          </Form>
        )}
      </Formik>
      <div className="flex items-center">
        <hr className="flex-grow border-gray-300" />
        <span className="px-3 text-gray-500">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Google Sign-In */}
      <Button
        variant="outline"
        className="w-full inline-flex items-center justify-center space-x-2"
        onClick={handleGoogleLogin}
      >
        <Image src={Google} alt="Google icon" width={20} height={20} />
        <span>Continue with Google</span>
      </Button>
    </div>
  );
}
