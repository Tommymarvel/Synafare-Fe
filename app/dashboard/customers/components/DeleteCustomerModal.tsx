'use client';

import { useEffect, useRef, useState } from 'react';
import AlertCircle from '@/app/assets/alert-circle.png';
import Image from 'next/image';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export default function DeleteCustomerModal({
  open,
  onClose,
  onConfirm,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await onConfirm();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className=" inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          ref={panelRef}
          tabIndex={-1}
          className="w-full max-w-[420px] rounded-2xl bg-white shadow-2xl outline-none"
        >
          <div className="px-6 pt-6 pb-4 text-center">
            {/* concentric danger icon */}
         
              <Image src={AlertCircle} alt="Danger Icon" width={48} className='mx-auto' />
         

            <h2 id="delete-title" className="text-lg font-medium mt-5 text-raisin">
              Delete Customer
            </h2>
            <p className="mt-2 text-sm text-raisin/70">
              Are you sure you want to delete this customer?
            </p>
          </div>

          {/* footer */}
          <div className="p-6 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="h-11 flex-1  rounded-lg border px-5 text-raisin hover:bg-neutral-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={busy}
              className="h-11 flex-1  rounded-lg bg-mikado px-5 text-raisin font-medium hover:bg-mikado/90 disabled:opacity-60"
            >
              {busy ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
