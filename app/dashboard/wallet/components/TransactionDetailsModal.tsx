// app/(dashboard)/wallet/components/TransactionDetailsModal.tsx
'use client';

import Image from 'next/image';
import { X, DownloadCloud } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useMemo } from 'react';
import TxnBg from '@/app/assets/transaction-bg.png';
import { Transaction } from '../hooks/useTransactions';
// NOTE: adjust the import path if your hook lives elsewhere

export default function TransactionDetailsModal({
  open,
  onClose,
  data,
  onDownload,
  amountIsKobo = false, // set true if trx_amount comes in kobo
}: {
  open: boolean;
  onClose: () => void;
  data: Transaction | null;
  onDownload?: () => void | Promise<void>;
  amountIsKobo?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // ✅ useMemo is called before early return, ensuring consistent hook order
  const channel = useMemo(() => {
    const t = data?.type?.toLowerCase?.() ?? '';
    if (t.includes('card')) return 'Card';
    if (t.includes('transfer') || t.includes('bank')) return 'Bank Transfer';
    if (t.includes('wallet')) return 'Wallet';
    return '—';
  }, [data?.type]);

  // Don’t render if closed or no data
  if (!open || !data) return null;

  const amountNumber = amountIsKobo ? data.amount / 100 : data.amount;
  const naira = `₦${new Intl.NumberFormat('en-NG').format(amountNumber)}`;

  // Best-effort channel inference (tweak if you store channel explicitly)
  const statusLabel = capitalize(data.status); // "successful" -> "Successful"
  const dateText = formatDateTime(data.date); // ISO -> "Aug 13, 2025, 4:08 PM"

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/40 p-4">
      <div className="relative w-full max-w-md">
        {/* Background image */}
        <Image
          src={TxnBg}
          alt="Transaction details"
          className="h-auto w-full rounded-2xl"
          priority
        />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1 text-white hover:bg-black/10"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Inner content */}
          <div className="flex flex-1 flex-col justify-center overflow-y-auto px-6 py-8">
            <h3 className="mb-6 text-center text-lg font-semibold text-raisin">
              Transaction Details
            </h3>

            <Row label="Transaction Date" value={dateText} />
            <Row label="Transaction Type" value={prettyType(data.type)} />
            <Row label="Payment Channel" value={channel} />
            <Row label="Amount" value={naira} />
            <Row label="Ref Code" value={data.refId} mono />
            <Row
              label="Status"
              value={
                <StatusBadge status={statusLabel}>{statusLabel}</StatusBadge>
              }
            />

            <div className="mt-8">
              <button
                onClick={onDownload}
                disabled={!onDownload}
                className={clsx(
                  'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold',
                  onDownload
                    ? 'bg-mikado text-raisin hover:bg-yellow-500'
                    : 'cursor-not-allowed bg-neutral-200 text-neutral-500'
                )}
              >
                <DownloadCloud className="h-5 w-5" />
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 py-3 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className={clsx('text-raisin', mono && 'font-mono')}>{value}</span>
    </div>
  );
}

function StatusBadge({
  status,
  children,
}: {
  status: 'Successful' | 'Pending' | 'Failed' | string;
  children: React.ReactNode;
}) {
  const s = (status || '').toLowerCase();
  const tone =
    s === 'successful'
      ? 'bg-green-50 text-green-600'
      : s === 'pending'
      ? 'bg-amber-50 text-amber-600'
      : 'bg-red-50 text-red-600';
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize',
        tone
      )}
    >
      {children}
    </span>
  );
}

function prettyType(t?: string) {
  if (!t) return '—';
  return t.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

function capitalize(s?: string) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDateTime(iso?: string) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
