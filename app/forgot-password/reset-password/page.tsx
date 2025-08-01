// 'use client';
// import { Button } from '@/app/components/ui/Button';
// import React, { useEffect, useRef, useState } from 'react';
// import TimeCircle from '@/app/assets/Time-Circle.svg';
// import Image from 'next/image';
// import Link from 'next/link';

// const Page = () => {
//   const [verificationCode, setVerificationCode] = useState([
//     '',
//     '',
//     '',
//     '',
//     '',
//     '',
//   ]);
//   const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
//   const [isShaking, setIsShaking] = useState(false);
//   const [otpStatus, setOtpStatus] = useState<'idle' | 'success' | 'failure'>(
//     'idle'
//   );
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const handleInput = (index: number, value: string) => {
//     // Allow only digits
//     if (!/^\d*$/.test(value)) return;

//     const newCode = [...verificationCode];
//     newCode[index] = value;
//     setVerificationCode(newCode);

//     // Move focus to the next input if a digit was entered and it's not the last input
//     if (value && index < verificationCode.length - 1) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (
//     e: React.ClipboardEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     e.preventDefault();
//     const pasteData = e.clipboardData.getData('text').trim();

//     // Ensure the pasted content contains only digits
//     if (!/^\d+$/.test(pasteData)) return;

//     const pasteDigits = pasteData.split('');
//     const newCode = [...verificationCode];

//     // Starting at the current index, fill in the inputs with pasted digits
//     for (let i = index; i < newCode.length && pasteDigits.length > 0; i++) {
//       newCode[i] = pasteDigits.shift()!;
//     }

//     setVerificationCode(newCode);

//     // Move focus to the next empty input, or if all are filled, focus the last input
//     const nextEmpty = newCode.findIndex((digit) => digit === '');
//     if (nextEmpty !== -1) {
//       inputRefs.current[nextEmpty]?.focus();
//     } else {
//       inputRefs.current[newCode.length - 1]?.focus();
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   useEffect(() => {
//     // Retrieve the stored expiry
//     const savedExpiry = localStorage.getItem('otpExpiry');
//     let expiryTime: number;

//     // Use the saved expiry if it exists and is in the future; otherwise, set a new expiry
//     if (
//       savedExpiry &&
//       !isNaN(Number(savedExpiry)) &&
//       Number(savedExpiry) > Date.now()
//     ) {
//       expiryTime = Number(savedExpiry);
//     } else {
//       expiryTime = Date.now() + 600 * 1000; // 10 minutes from now
//       localStorage.setItem('otpExpiry', expiryTime.toString());
//     }

//     const updateTimeLeft = () => {
//       const secondsLeft = Math.max(
//         0,
//         Math.floor((expiryTime - Date.now()) / 1000)
//       );
//       setTimeLeft(secondsLeft);
//     };

//     updateTimeLeft(); // Initialize immediately

//     const timer = setInterval(updateTimeLeft, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="w-full max-w-[624px] px-4">
//       <h1 className="text-[24px] md:text-[34px] font-inter-bold text-center text-raisin mb-2">
//         Reset Password
//       </h1>
//       <p className="text-[#645D5D] text-sm mb-8 text-center">
//         Enter verification code sent to <strong>jonsmith1234@gmail.com </strong>
//       </p>

//       <div className="grid grid-flow-col auto-cols-fr gap-1 w-full mb-6">
//         {verificationCode.map((code, i) => (
//           <input
//             key={i}
//             ref={(el) => {
//               inputRefs.current[i] = el;
//             }}
//             type="text"
//             maxLength={1}
//             value={code}
//             onChange={(e) => handleInput(i, e.target.value)}
//             onKeyDown={(e) => handleKeyDown(e, i)}
//             onPaste={(e) => handlePaste(e, i)}
//             className="
//         w-full           /* fill the grid cell’s width */
//         aspect-square    /* make height match width */
//         text-center
//         border border-[#DCDCDC]
//         rounded-md
//         text-xl
//         focus:ring-2 focus:ring-mikado text-raisin focus:outline-none
//       "
//           />
//         ))}
//       </div>
//       <div className="flex gap-0.5 mb-8 mx-auto w-fit items-center text-[#989898]">
//         <Image src={TimeCircle} alt="" width={16} height={16} /> Expires in{' '}
//         <span className="text-[#667185] font-medium">
//           {formatTime(timeLeft)}
//         </span>
//       </div>
//       <div className={isShaking ? 'shake' : ''}>
//         <Button className="w-full rounded mb-4 ">Verify</Button>
//       </div>
//       <div className="text-center">
//         <Link
//           href="/login"
//           className="text-sm underline font-semibold text-raisin"
//         >
//           Back to Login
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Page;
