'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Success from '@/app/assets/success.png';

export default function SubmissionSuccess() {
  const router = useRouter();

  return (
    <div className=" py-10 min-h-[80vh] grid place-items-center">
      <div className="w-[320px] sm:w-[360px] p-6 text-center">
        {/* Icon */}
        <div className=" mb-6  ">
          <Image
            src={Success}
            alt="Success icon"
            className="mx-auto size-[217px]"
          />
        </div>

        {/* Text */}
        <h3 className="text-lg font-semibold text-raisin">
          Transaction Successful
        </h3>
        <p className="mt-2 text-sm text-[#645D5D]">
          Your ₦375,000 downpayment was successful and your loan will be
          disbursed shortly
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push('/dashboard/loans')}
          className="mt-6 font-medium w-full rounded-md bg-mikado py-2.5 text-raisin hover:bg-mikado/90"
        >
          Back to Loans
        </button>
      </div>
    </div>
  );
}

