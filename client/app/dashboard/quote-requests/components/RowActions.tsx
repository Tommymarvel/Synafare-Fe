'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { createPortal } from 'react-dom';

// Types
export type QuoteRequestStatus =
  | 'PENDING'
  | 'QUOTE_SENT'
  | 'NEGOTIATED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'DELIVERED';

export interface QuoteRequest {
  id: string;
  customer: string;
  customerEmail: string;
  product: string;
  quantity: number;
  quoteSent: number | null;
  counterAmount: number | null;
  dateRequested: string;
  status: QuoteRequestStatus;
  supplierName?: string;
  productCategory?: string;
  message?: string;
  supplierResponse?: string;
  deliveryLocation?: string;
}

type RowAction =
  | 'viewRequest'
  | 'sendQuote'
  | 'viewQuote'
  | 'acceptRequest'
  | 'rejectRequest'
  | 'view';

export function RowActions({
  quoteRequest,
  onAction,
}: {
  quoteRequest: QuoteRequest;
  onAction?: (action: RowAction, quoteRequest: QuoteRequest) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const positionMenu = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    // align right edges; menu width = 192px (w-48)
    setCoords({ top: r.bottom + 8, left: r.right - 192 });
  };

  const toggle = () => {
    if (!open) positionMenu();
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;

    const onDocPointer = (e: Event) => {
      const t = e.target as Node | null;
      const clickInsideButton = !!btnRef.current && btnRef.current.contains(t);
      const clickInsideMenu = !!menuRef.current && menuRef.current.contains(t);
      if (!clickInsideButton && !clickInsideMenu) setOpen(false);
    };

    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onReposition = () => positionMenu();

    document.addEventListener('pointerdown', onDocPointer);
    document.addEventListener('keydown', onEsc);
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);

    return () => {
      document.removeEventListener('pointerdown', onDocPointer);
      document.removeEventListener('keydown', onEsc);
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [open]);

  return (
    <div className="relative inline-flex">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 text-neutral-500 hover:text-neutral-700"
        title="More"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-[1000] w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5 p-2"
            style={{ top: coords.top, left: coords.left }}
          >
            <div className="space-y-1">
              {buildMenuForStatus(quoteRequest.status).map(
                ({ key, label, tone }) => (
                  <button
                    key={key}
                    role="menuitem"
                    onMouseDown={() => {
                      setOpen(false);
                      onAction?.(key, quoteRequest);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      tone === 'danger'
                        ? 'hover:bg-red-50 text-red-600'
                        : 'hover:bg-gray-50 text-raisin'
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function buildMenuForStatus(
  status: QuoteRequestStatus
): { key: RowAction; label: string; tone?: 'danger' }[] {
  switch (status) {
    case 'PENDING':
      return [
        { key: 'viewRequest', label: 'View Request' },
        { key: 'sendQuote', label: 'Send Quote' },
      ];
    case 'QUOTE_SENT':
      return [{ key: 'viewQuote', label: 'View Quote' }];
    case 'NEGOTIATED':
      return [
        { key: 'viewRequest', label: 'View Request' },
        { key: 'acceptRequest', label: 'Accept Request' },
        { key: 'rejectRequest', label: 'Reject Request', tone: 'danger' },
      ];
    case 'REJECTED':
    case 'ACCEPTED':
    case 'DELIVERED':
      return [{ key: 'view', label: 'View' }];
    default:
      return [{ key: 'viewRequest', label: 'View Request' }];
  }
}
