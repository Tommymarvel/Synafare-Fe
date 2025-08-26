'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { createPortal } from 'react-dom';

// Types
export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE';

export interface Invoice {
  id: string;
  invoiceId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  subtotal: number;
  taxAmount: number;
  status: InvoiceStatus;
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  notes?: string;
}

export type RowAction =
  | 'view'
  | 'edit'
  | 'delete'
  | 'markPaid'
  | 'send'
  | 'download';

export function RowActions({
  invoice,
  onAction,
}: {
  invoice: Invoice;
  onAction?: (action: RowAction, invoice: Invoice) => void;
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
              {buildMenuForStatus(invoice.status).map(
                ({ key, label, tone }) => (
                  <button
                    key={key}
                    role="menuitem"
                    onMouseDown={() => {
                      setOpen(false);
                      onAction?.(key, invoice);
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
  status: InvoiceStatus
): { key: RowAction; label: string; tone?: 'danger' }[] {
  switch (status) {
    case 'DRAFT':
      return [
        { key: 'edit', label: 'Edit' },
        { key: 'delete', label: 'Delete', tone: 'danger' },
      ];
    case 'PENDING':
      return [
        { key: 'view', label: 'View' },
        { key: 'edit', label: 'Edit' },
        { key: 'download', label: 'Download' },
        { key: 'send', label: 'Resend Invoice' },
        { key: 'markPaid', label: 'Mark as Paid' },
        { key: 'delete', label: 'Delete', tone: 'danger' },
      ];
    case 'OVERDUE':
      return [
        { key: 'view', label: 'View' },
        { key: 'edit', label: 'Edit' },
        { key: 'download', label: 'Download' },
        { key: 'send', label: 'Resend Invoice' },
        { key: 'markPaid', label: 'Mark as Paid' },
        { key: 'delete', label: 'Delete', tone: 'danger' },
      ];
    case 'PAID':
      return [
        { key: 'view', label: 'Preview' },
        { key: 'download', label: 'Download' },
        { key: 'delete', label: 'Delete', tone: 'danger' },
      ];
    default:
      return [
        { key: 'view', label: 'View' },
        { key: 'edit', label: 'Edit' },
      ];
  }
}
