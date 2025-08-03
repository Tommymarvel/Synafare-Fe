// app/signup/verify-otp/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TimeCircle from '@/app/assets/Time-Circle.svg';
import { Button } from '@/app/components/ui/Button';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';

const OTP_LENGTH = 5;

export default function VerifyOtpPage() {
  const router = useRouter();

  // State
  const [email, setEmail] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(OTP_LENGTH).fill('')
  );
  const [timeLeft, setTimeLeft] = useState(600); // in seconds
  const [isShaking, setIsShaking] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // On mount: grab email or bounce to signup
  useEffect(() => {
    const saved = sessionStorage.getItem('verifyEmail');
    if (!saved) {
      router.replace('/signup');
    } else {
      setEmail(saved);
    }
  }, [router]);

  // Timer logic (10 min expiry saved in localStorage)
  useEffect(() => {
    const savedExpiry = Number(localStorage.getItem('otpExpiry') || '0');
    const now = Date.now();
    const expiryTime =
      savedExpiry && savedExpiry > now
        ? savedExpiry
        : now + 600 * 500; /* 5m */

    localStorage.setItem('otpExpiry', expiryTime.toString());

    const tick = () => {
      const secs = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setTimeLeft(secs);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Input handlers
  const handleInput = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...verificationCode];
    next[i] = val;
    setVerificationCode(next);
    if (val && i < OTP_LENGTH - 1) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.key === 'Backspace' && !verificationCode[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    i: number
  ) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(paste)) return;
    const digits = paste.split('');
    const next = [...verificationCode];
    for (let j = i; j < OTP_LENGTH && digits.length; j++) {
      next[j] = digits.shift()!;
    }
    setVerificationCode(next);
    const firstEmpty = next.findIndex((d) => !d);
    inputRefs.current[firstEmpty > -1 ? firstEmpty : OTP_LENGTH - 1]?.focus();
  };

  // Verify handler
  const handleVerify = async () => {
    if (!email) return;
    const otp = verificationCode.join('');
    if (otp.length < OTP_LENGTH) {
      shake();
      return;
    }

    try {
      await axiosInstance.post('/otp/validate', { email, otp });
      sessionStorage.removeItem('verifyEmail');
      toast.success('Email verified! Redirecting…');
      router.push('/login');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      toast.error(
        (axiosError.response && axiosError.response.data
          ? axiosError.response.data.message || axiosError.response.data
          : axiosError.message || 'An error occurred'
        ).toString()
      );

      shake();
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await axiosInstance.post('/otp/request', { email });
      toast.success('Verification code resent!');
      const newExpiryTime = Date.now() + 600 * 1000; // 10 minutes
      localStorage.setItem('otpExpiry', newExpiryTime.toString());
      setTimeLeft(600);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || 'Something went wrong');
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const shake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  // If email not loaded yet, don't render
  if (email === null) return null;

  return (
    <div className="w-full max-w-[500px] mx-4">
      <h1 className="text-[24px] md:text-[34px] font-inter-bold text-center text-raisin mb-2">
        You’ve got mail
      </h1>
      <p className="text-[#645D5D] text-sm mb-8 text-center">
        Enter verification code sent to <strong>{email} </strong>
      </p>
      <div className="flex gap-1 w-fit mx-auto  mb-6">
        {verificationCode.map((code, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            maxLength={1}
            value={code}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={(e) => handlePaste(e, i)}
            className=" w-10 h-10 md:w-12 md:h-12  text-center  border border-[#DCDCDC] rounded-md text-raisin text-xl  focus:ring-2 focus:ring-mikado focus:ring-offset-0 focus:outline-none"
          />
        ))}
      </div>
      <div className="flex gap-0.5 mb-8 mx-auto w-fit items-center text-[#989898]">
        {formatTime(timeLeft) !== '0:00' ? (
          <>
            <Image src={TimeCircle} alt="" width={16} height={16} /> Expires in{' '}
            <span className="text-[#667185] font-medium">
              {formatTime(timeLeft)}
            </span>
          </>
        ) : (
          <span className="text-red-500 flex items-center gap-1">
            Code expired.{' '}
            <p onClick={handleResend} className="underline cursor-pointer">
              Resend
            </p>
          </span>
        )}
      </div>
      <div className={isShaking ? 'shake' : ''}>
        <Button className="w-full rounded mb-4 " onClick={handleVerify}>
          Verify
        </Button>
      </div>
    </div>
  );
}
