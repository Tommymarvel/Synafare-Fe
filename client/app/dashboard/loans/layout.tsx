// /app/dashboard/layout.tsx
import React, { ReactNode } from 'react';



interface DashboardLayoutProps {
  children: ReactNode;
}

export default function LoanLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

// Optional: add metadata for Next.js if you want to set titles, etc.
// export const metadata = { title: 'Dashboard – Synafare' }
