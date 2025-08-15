"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const GoBack = ({ className }: { className?: string }) => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={cn("flex gap-x-3 items-center ", className)}
    >
      <div className="border border-border-gray w-6 h-6 flex items-center justify-center rounded-sm">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className="fill-resin-black"
        >
          <path
            d="M1.14645 6.35355C0.951185 6.15829 0.951185 5.84171 1.14645 5.64645L3.14645 3.64645C3.34171 3.45118 3.65829 3.45118 3.85355 3.64645C4.04882 3.84171 4.04882 4.15829 3.85355 4.35355L2.70711 5.5L10.5 5.5C10.7761 5.5 11 5.72386 11 6C11 6.27614 10.7761 6.5 10.5 6.5L2.70711 6.5L3.85355 7.64645C4.04882 7.84171 4.04882 8.15829 3.85355 8.35355C3.65829 8.54882 3.34171 8.54882 3.14645 8.35355L1.14645 6.35355Z"
            fill="#1D1C1D"
          />
        </svg>
      </div>
      <p className="text-gray-3 font-medium">Go Back</p>
    </button>
  );
};

export default GoBack;
