'use client';
import React, { useState } from 'react';
import { Input } from '../components/form/Input';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import {
  AuthErrorCodes,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axiosInstance from '@/lib/axiosInstance';
import Image from 'next/image';
import Google from '@/app/assets/google-icon.png';
import { useSignupFlow } from '@/hooks/useAuthFlows';
import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';

interface SignUpValues {
  email: string;
  password: string;
}

const SignUpSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const initialValues: SignUpValues = { email: '', password: '' };

export default function SignUpPage() {
  const [show, setShow] = useState(false);
  const { signup, submitting } = useSignupFlow();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);

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

      if (res.data.status === 204) {
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
      }
    } finally {
      setIsLogin(false);
    }
  };

  return (
    <div className="w-full space-y-4 lg:space-y-8 max-w-[500px] mx-5 lg:mx-[64px] mb-[32px]">
      {isLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mikado"></div>
            <p className="text-gray-700 font-medium">Logging you in...</p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl lg:text-[34px] font-medium text-raisin text-center">
          Welcome to Synafare
        </h1>
        <p className="text-sm text-[#645D5D] mt-2 text-center">
          Provide your information to get started
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={SignUpSchema}
        onSubmit={({ email, password }) => signup(email, password)}
      >
        {({ isValid, isSubmitting }) => (
          <Form className="space-y-4">
            {/* Email */}
            <Field name="email">
              {({ field, meta }: FieldProps) => (
                <>
                  <Input
                    {...field}
                    label="Email Address"
                    variant="outline"
                    type="email"
                    placeholder="you@email.com"
                    size="lg"
                    hasError={meta.touched && !!meta.error}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </>
              )}
            </Field>

            {/* Password */}
            <Field name="password">
              {({ field, meta }: FieldProps) => (
                <div>
                  <span className="relative w-full">
                    <Input
                      {...field}
                      label="Password"
                      variant="outline"
                      type={show ? 'text' : 'password'}
                      placeholder="Enter your password"
                      size="lg"
                      hasError={meta.touched && !!meta.error}
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      className="absolute right-4 top-[68%] transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={show ? 'Hide password' : 'Show password'}
                    >
                      {show ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </span>

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              )}
            </Field>

            {/* Submit */}
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={!isValid || isSubmitting}
            >
              {submitting ? 'Creating Account...' : ' Continue with this email'}
            </Button>
          </Form>
        )}
      </Formik>

      <p className="text-center text-raisin">OR</p>
      <Button
        variant="outline"
        className="w-full inline-flex items-center justify-center space-x-2"
        onClick={handleGoogleLogin}
      >
        <Image src={Google} alt="Google Icon" width={20} height={20} />
        <span>Continue with Google</span>
      </Button>
      <footer className="text-center text-[#645D5D]  text-sm leading-[145%] mb-12">
        By clicking “Sign Up”, you agree to Synafare’s{' '}
        <a
          href="/privacy"
          className="underline decoration-solid decoration-skip-ink-none decoration-auto underline-offset-auto underline-from-font text-raisin"
        >
          Privacy Policy
        </a>{' '}
        and{' '}
        <a
          href="/terms"
          className="underline decoration-solid decoration-skip-ink-none decoration-auto underline-offset-auto underline-from-font text-raisin"
        >
          Terms of Use{' '}
        </a>
      </footer>
    </div>
  );
}
