// /app/dashboard/layout.tsx
import React, { ReactNode } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';


interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left nav */}
      <aside className="w-64   border-r bg-white">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
          <Header />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

// Optional: add metadata for Next.js if you want to set titles, etc.
// export const metadata = { title: 'Dashboard – Synafare' }
