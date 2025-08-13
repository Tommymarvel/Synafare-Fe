// hooks/useAuthFlows.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import axiosInstance from '@/lib/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { AxiosError, isAxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';

export function useSignupFlow() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function signup(email: string, password: string) {
    setSubmitting(true);
    try {
      // 1) create user
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // 2) grab token
      const idToken = await cred.user.getIdToken();

      // 3) tell your backend
      await axiosInstance.post('/auth/login', { idToken });

      // 5) stash email and navigate
      sessionStorage.setItem('verifyEmail', email);
      toast.info('Account created. Check email to verify.');
      router.push('/signup/verify-otp');
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
  }

  return { signup, submitting };
}

type BackendUser = {
  bvn: string | null;
  business_document?: 'submitted' | string;
};

type LoginSuccessResponse = {
  token: string;
  user: BackendUser;
};

type OtpPendingResponse = {
  message?: string; // "Otp has been sent to your email, kindly proceed…"
  status?: number; // 204 (in body)
};

type LoginValues = { email: string; password: string };

function isOtpBody(body: unknown): body is OtpPendingResponse {
  if (!body || typeof body !== 'object') return false;
  const m = (body as OtpPendingResponse).message ?? '';
  const s = (body as OtpPendingResponse).status;
  return s === 204 || /otp has been sent/i.test(m);
}

export function useLoginFlow() {
  const router = useRouter();
  const { refreshUser } = useAuth();
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

      // keep email for OTP flow
      sessionStorage.setItem('verifyEmail', values.email || '');

      // 2) Backend login
      const res = await axiosInstance.post<
        LoginSuccessResponse | OtpPendingResponse
      >('/auth/login', { idToken });

      // 3) OTP path (backend sometimes puts "status: 204" inside the body)
      if (res.status === 204 || isOtpBody(res.data)) {
        toast.info('Please verify your email.');
        // ensure there is no stale token
        localStorage.removeItem('authToken');
        router.replace('/signup/verify-otp');
        return;
      }

      // 4) Success path
      const data = res.data as LoginSuccessResponse | undefined;
      if (!data?.token) {
        throw new Error('Empty token from server');
      }

      localStorage.setItem('authToken', data.token);
      await refreshUser();

      // 5) Route by user state (only read when present)
      const u = data.user;
      if (!u || u.bvn == null) {
        router.replace('/signup/onboarding');
        return;
      }
      if (u.business_document !== 'submitted') {
        router.replace('/signup/business-info');
        return;
      }
      router.replace('/dashboard');
    } catch (error) {
      // keep email available for OTP page on failure
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

        // Some deployments may return OTP hint via 200+message as well
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