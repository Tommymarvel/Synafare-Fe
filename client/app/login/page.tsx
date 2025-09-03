'use client';
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import { Input } from '../components/form/Input';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase';
import {
  AuthErrorCodes,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import axiosInstance from '@/lib/axiosInstance';
import Google from '@/app/assets/google-icon.png';
import Image from 'next/image';
import { useLoginFlow } from '@/hooks/useAuthFlows';
import { FirebaseError } from 'firebase/app';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const { login } = useLoginFlow();

  const handleGoogleLogin = async () => {
    let sessionEmail = '';

    try {
      sessionStorage.removeItem('verifyEmail');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      sessionEmail = result.user.email || '';
      sessionStorage.setItem('verifyEmail', sessionEmail);
      setIsLogin(true);
      const res = await axiosInstance.post('/auth/login', { idToken });

      const token = res.data.token;

      if (token) {
        localStorage.setItem('authToken', token);
      }

      console.log(res);

      if (res.data.status === 304) {
        console.log('redirecting...');
        toast.info('Please verify your email.');

        router.push('/signup/verify-otp');
        return;
      }

      const backendUser = res.data.user;
      if (backendUser.bvn == null) {
        router.push('/signup/onboarding');
      } else if (backendUser.business_document !== 'submitted') {
        router.push('/signup/business-info');
      } else {
        router.push('/dashboard');
      }

      // await refreshUser();
    } catch (error) {
      if (sessionEmail) {
        sessionStorage.setItem('verifyEmail', sessionEmail);
      }

      if (error instanceof FirebaseError) {
        let msg: string;
        switch (error.code) {
          case AuthErrorCodes.POPUP_CLOSED_BY_USER:
            msg = 'Authentication popup was closed before completing sign-in.';
            break;
          case AuthErrorCodes.NETWORK_REQUEST_FAILED:
            msg = 'Network error — please check your connection and try again.';
            break;
          case AuthErrorCodes.INVALID_OAUTH_CLIENT_ID:
            msg = 'Configuration error — please contact support.';
            break;
          default:
            msg = error.message;
        }
        toast.error(msg);
      }

      const axiosError = error as AxiosError<{ message?: string }>;
      if (
        axiosError.response?.data.message ===
        'Looks like we sent you one recently, kindly check for that and input in the fields'
      ) {
        toast.error(
          'Looks like we sent you one recently, kindly check for that and input in the fields'
        );

        router.push('/signup/verify-otp');
      } else {
        toast.error(
          (axiosError.response && axiosError.response.data
            ? axiosError.response.data.message || axiosError.response.data
            : axiosError.message || 'An error occurred'
          ).toString()
        );
      }
    } finally {
      setIsLoading(false);
      setIsLogin(false);
    }
  };

  const handleLogin = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      await login(values);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 lg:space-y-8 max-w-[500px] mx-5 lg:mx-[64px] mb-[32px]">
      {/* Loading Overlay */}
      {isLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mikado"></div>
            <p className="text-gray-700 font-medium">Logging you in...</p>
          </div>
        </div>
      )}

      <div>
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
          onSubmit={handleLogin}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="space-y-4 ">
              {/* Email */}
              <div>
                <span className="relative w-full">
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
                </span>
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
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign-In */}
        <Button
          variant="outline"
          className="w-full inline-flex items-center justify-center space-x-2"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <Image src={Google} alt="Google icon" width={20} height={20} />
          <span>Continue with Google</span>
        </Button>
      </div>
    </div>
  );
}
