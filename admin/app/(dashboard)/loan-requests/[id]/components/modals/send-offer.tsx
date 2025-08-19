// 'use client';

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogClose,
// } from '@/components/ui/dialog';
// import { DialogTitle } from '@radix-ui/react-dialog';
// import { useEffect, useMemo, useState } from 'react';
// import ConfirmAccept from './confirm-accept';
// import Button from '@/components/button';
// import axiosInstance from '@/lib/axiosInstance';

// const fmtNaira = (n: number) =>
//   new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
//     n ?? 0
//   );

// type Props = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;

//   // from the selected loan
//   loanId: string;
//   amountRequested: number;
//   transactionCost: number;
//   defaultDurationMonths: number; // e.g., 3
//   defaultMonthlyRate?: number; // e.g., 0.06 (6%/mo)
// };

// export default function SendOfferModal({
//   open,
//   onOpenChange,
//   loanId,
//   amountRequested,
//   transactionCost,
//   defaultDurationMonths,
//   defaultMonthlyRate = 0.06,
// }: Props) {
//   const [showConfirmAccept, setShowConfirmAccept] = useState(false);

//   // form state
//   const [amountOffered, setAmountOffered] = useState<number>(amountRequested);
//   const [monthlyRate, setMonthlyRate] = useState<number>(defaultMonthlyRate);
//   const [durationMonths, setDurationMonths] = useState<number>(
//     defaultDurationMonths
//   );

//   const [submitting, setSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string>('');

//   // Reset form when modal opens
//   useEffect(() => {
//     if (open) {
//       setAmountOffered(amountRequested);
//       setMonthlyRate(defaultMonthlyRate);
//       setDurationMonths(defaultDurationMonths);
//       setErrorMsg('');
//     }
//   }, [open, amountRequested, defaultMonthlyRate, defaultDurationMonths]);

//   // Live computed values (to display only)
//   const computed = useMemo(() => {
//     // back-end uses: interest = (loan_amount × 0.06 × 3)
//     // we'll preview using current form rate & duration for UX
//     const totalInterest = amountOffered * monthlyRate * durationMonths;
//     const totalRepayment = amountOffered + totalInterest;
//     const monthlyInstallment =
//       durationMonths > 0 ? totalRepayment / durationMonths : 0;

//     return {
//       totalInterest,
//       totalRepayment,
//       monthlyInstallment,
//     };
//   }, [amountOffered, monthlyRate, durationMonths]);

//   const disabled =
//     submitting ||
//     !amountOffered ||
//     amountOffered <= 0 || // must differ
//     amountOffered > transactionCost; // cannot exceed cost

//   async function handleSendOffer() {
//     setErrorMsg('');

//     // FE validation (mirrors your Action Rules)
//     if (!amountOffered || amountOffered <= 0) {
//       setErrorMsg('Amount offered must be greater than 0.');
//       return;
//     }

//     if (amountOffered > transactionCost) {
//       setErrorMsg('Amount offered cannot exceed transaction cost.');
//       return;
//     }

//     try {
//       setSubmitting(true);

//       // Per spec, only amountOffered is required for "offer";
//       // backend will calculate the rest.
//       await axiosInstance.patch(`/loan/admin/action/${loanId}`, {
//         actionType: 'offer',
//         amountOffered,
//       });

//       // close this modal, open confirmation
//       onOpenChange(false);
//       // setShowConfirmAccept(true);
//     } catch (e: unknown) {
//       console.error('Failed to send offer:', e);
//       setErrorMsg(
//         'Failed to send offer. Please check your inputs or try again.'
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <>
//       <ConfirmAccept
//         open={showConfirmAccept}
//         onOpenChange={setShowConfirmAccept}
//       />

//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent className="px-[27px] bg-white no-x py-0 max-w-[555px] pb-[17px] border-0 rounded-xl">
//           <DialogHeader className="hidden">
//             <DialogTitle>Accept Request</DialogTitle>
//           </DialogHeader>

//           <div className="border-b border-b-gray-4 pt-[33px] pb-4 flex justify-between items-center">
//             <h1 className="text-xl font-semibold">Accept Request</h1>
//             <DialogClose asChild>
//               <span className="block cursor-pointer">
//                 <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
//                   <path
//                     d="M10.9969 28.5077C10.3473 29.1572 10.3163 30.317 11.0124 30.982C11.6775 31.6778 12.8531 31.6469 13.5028 30.9974L21.0048 23.4974L28.5069 30.9974C29.172 31.6624 30.3167 31.6778 30.9818 30.982C31.6779 30.317 31.6624 29.1572 30.9973 28.4923L23.4952 20.9923L30.9973 13.5077C31.6624 12.8273 31.6779 11.683 30.9818 11.018C30.3167 10.3222 29.172 10.3376 28.5069 11.0026L21.0048 18.5026L13.5028 11.0026C12.8531 10.3531 11.6775 10.3222 11.0124 11.018C10.3163 11.683 10.3473 12.8428 10.9969 13.4923L18.499 20.9923L10.9969 28.5077Z"
//                     fill="#344054"
//                   />
//                 </svg>
//               </span>
//             </DialogClose>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="font-medium block">Amount Requested</label>
//               <input
//                 type="text"
//                 className="border border-gray-300 p-4 rounded-md w-full bg-[#F0F2F5]"
//                 disabled
//                 value={fmtNaira(amountRequested)}
//                 readOnly
//               />
//             </div>

//             <div>
//               <label className="font-medium block">
//                 Amount Offered <span className="text-red-700">*</span>
//               </label>
//               <input
//                 type="number"
//                 className="border border-gray-300 p-4 rounded-md w-full"
//                 value={amountOffered}
//                 onChange={(e) => setAmountOffered(Number(e.target.value || 0))}
//                 min={0}
//               />
//             </div>

//             <div className="flex gap-x-4">
//               <div className="flex-1">
//                 <label className="font-medium block">
//                   Interest Rate (per month){' '}
//                   <span className="text-red-700">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="border border-gray-300 p-4 rounded-md w-full"
//                   value={monthlyRate}
//                   onChange={(e) => setMonthlyRate(Number(e.target.value || 0))}
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="font-medium block">
//                   Duration (months) <span className="text-red-700">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   className="border border-gray-300 p-4 rounded-md w-full"
//                   value={durationMonths}
//                   onChange={(e) =>
//                     setDurationMonths(Number(e.target.value || 0))
//                   }
//                   min={1}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="font-medium block">Monthly Installment</label>
//               <input
//                 type="text"
//                 className="border border-gray-300 p-4 rounded-md w-full bg-[#F0F2F5]"
//                 disabled
//                 value={fmtNaira(computed.monthlyInstallment)}
//                 readOnly
//               />
//             </div>

//             <span className="text-[#667185]">
//               Total Repayment:{' '}
//               <span className="text-resin-black">
//                 {fmtNaira(computed.totalRepayment)}
//               </span>
//             </span>

//             {errorMsg && (
//               <p className="text-sm text-red-600 mt-2">{errorMsg}</p>
//             )}

//             <div className="flex gap-x-4 justify-center mt-5 font-medium">
//               <DialogClose asChild>
//                 <Button
//                   variant="Colored"
//                   className="px-[64px] py-4"
//                   disabled={submitting}
//                 >
//                   Cancel
//                 </Button>
//               </DialogClose>

//               <Button
//                 className="px-[64px] py-4"
//                 onClick={handleSendOffer}
//                 disabled={disabled}
//               >
//                 {submitting ? 'Sending…' : 'Send Offer'}
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }



