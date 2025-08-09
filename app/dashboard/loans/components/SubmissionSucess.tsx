'use client';

import { useRouter } from 'next/navigation';

export default function SubmissionSuccess() {
  const router = useRouter();

  return (
    <div className="px-4 py-10 min-h-[60vh] grid place-items-center">
      <div className="w-[320px] sm:w-[360px] rounded-2xl border bg-white shadow-sm p-6 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 rounded-full bg-mikado/25 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="218"
            height="218"
            viewBox="0 0 218 218"
            fill="none"
          >
            <circle
              opacity="0.2"
              cx="108.999"
              cy="108.604"
              r="108.604"
              fill="#E2A109"
            />
          </svg>
        </div>

        {/* Text */}
        <h3 className="text-lg font-semibold text-raisin">
          Application Successful
        </h3>
        <p className="mt-2 text-sm text-raisin/70">
          Your application has been submitted for review. You will receive a
          response shortly
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push('/dashboard/loans')}
          className="mt-6 w-full rounded-xl bg-mikado py-2.5 text-raisin hover:bg-mikado/90"
        >
          Back to Loans
        </button>
      </div>
    </div>
  );
}
