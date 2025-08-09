// /app/dashboard/layout.tsx
'use client';
import React, { ReactNode, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';


interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
   const { user, loading } = useAuth();
   const router = useRouter();
   const path = usePathname();

   useEffect(() => {
     if (!loading && !user)
       router.replace(`/login?next=${encodeURIComponent(path)}`);
   }, [loading, user, path, router]);

   if (loading) return <div className="p-6">Loading…</div>;
   if (!user) return null;
  return (
    <div className="flex h-screen">
      {/* Left nav */}
      <aside className="w-64 hidden md:block  border-r bg-white">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
          <Header />
        </header>

        {/* Page content */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-5">
          {children}
        </main>
      </div>
    </div>
  );
}

// Optional: add metadata for Next.js if you want to set titles, etc.
// export const metadata = { title: 'Dashboard – Synafare' }
