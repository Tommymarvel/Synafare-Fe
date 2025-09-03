'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { AuthErrorCodes } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axiosInstance from '@/lib/axiosInstance';
import { auth } from '@/lib/firebase';

export type LoginValues = { email: string; password: string };

type LoginSuccessResponse = {
  token: string;
  user?: {
    bvn?: string | null;
    business_document?: 'submitted' | 'pending' | string;
    // …any other fields you use
  };
};

type OtpPendingResponse = { message?: string; status?: number };

function isOtpBody(x: unknown): x is OtpPendingResponse {
  const m = (x as OtpPendingResponse | undefined)?.message ?? '';
  const s = (x as OtpPendingResponse | undefined)?.status;
  return s === 204 || /otp|verify|email/i.test(m);
}

export function useLoginFlow() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function login(values: LoginValues) {
    setSubmitting(true);
    try {
      // 1) Firebase sign-in
      const cred = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const idToken = await cred.user.getIdToken();

      // keep email for OTP page
      sessionStorage.setItem('verifyEmail', values.email || '');

      // 2) Backend login
      const res = await axiosInstance.post<
        LoginSuccessResponse | OtpPendingResponse
      >('/auth/login', { idToken });

      // 3) OTP path (some envs use 204 in body or HTTP 204)
      if (res.status === 204 || isOtpBody(res.data)) {
        toast.info('Please verify your email.');
        localStorage.removeItem('authToken'); // ensure no stale token
        router.replace('/signup/verify-otp');
        return;
      }

      // 4) Success path
      const data = res.data as LoginSuccessResponse | undefined;
      if (!data?.token) throw new Error('Empty token from server');

      localStorage.setItem('authToken', data.token);
      // Note: No refreshUser call since this hook is used on login page where AuthContext isn't available

      router.replace('/');
    } catch (error) {
      // let OTP page know the email even if we failed
      sessionStorage.setItem('verifyEmail', values.email || '');

      // Firebase errors
      if (error instanceof FirebaseError) {
        const map: Record<string, string> = {
          [AuthErrorCodes.INVALID_PASSWORD]: 'Incorrect email or password.',
          [AuthErrorCodes.USER_DELETED]: 'No account found for that email.',
          [AuthErrorCodes.NETWORK_REQUEST_FAILED]:
            'Network error — check your connection.',
          [AuthErrorCodes.POPUP_CLOSED_BY_USER]:
            'Authentication popup was closed.',
          [AuthErrorCodes.INVALID_OAUTH_CLIENT_ID]:
            'Configuration error — contact support.',
        };
        toast.error(map[error.code] ?? error.message);
        return;
      }

      // Axios / backend errors
      if (isAxiosError(error)) {
        const msg =
          (error.response?.data as { message?: string } | undefined)?.message ??
          '';
        const status = error.response?.status;

        // 5-minute cooldown case
        if (status === 400 && /sent you one recently/i.test(msg)) {
          toast.info(
            'OTP already sent. Please check your email and enter the code.'
          );
          router.replace('/signup/verify-otp');
          return;
        }

        if (isOtpBody(error.response?.data)) {
          toast.info('Please verify your email.');
          router.replace('/signup/verify-otp');
          return;
        }

        toast.error(msg || 'Unable to sign in. Please try again.');
        return;
      }

      // Fallback
      toast.error((error as Error).message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return { login, submitting };
}
