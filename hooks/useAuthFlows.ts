// hooks/useAuthFlows.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import axiosInstance from '@/lib/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

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



interface LoginValues {
  email: string;
  password: string;
}

interface BackendLoginResponse {
  statusCode?: number;
  user: {
    _id: string;
    email: string;
    bvn?: string | null;
    business_document: string;
    // add any other fields your backend returns
  };
  token?: string; // optional, if your backend returns a token
}

export function useLoginFlow() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  async function login(values: LoginValues) {
    setSubmitting(true);
    try {
      // 1️⃣ Firebase sign-in
      const cred = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const idToken = await cred.user.getIdToken();

      // 2️⃣ Backend login
      const res = await axiosInstance.post<BackendLoginResponse>(
        '/auth/login',
        { idToken }
      );

      const token = res.data.token;
      console.log(token);

      localStorage.setItem('authToken', token || '');

      // 3️⃣ Store email for OTP flow
      sessionStorage.setItem('verifyEmail', values.email);

      // 4️⃣ OTP step if backend signals 204 or custom 400
      if (res.status === 204 || res.data.statusCode === 400) {
        router.push('/signup/verify-otp');
        return;
      }

      // 5️⃣ Route based on backend user payload
      const backendUser = res.data.user;
      if (backendUser.bvn == null) {
        router.push('/signup/onboarding');
      } else if (backendUser.business_document !== 'submitted') {
        router.push('/signup/business-info');
      } else {
        router.push('/dashboard');
      }

      // 6️⃣ Refresh the React Context user
      await refreshUser();
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

  return { login, submitting };
}

