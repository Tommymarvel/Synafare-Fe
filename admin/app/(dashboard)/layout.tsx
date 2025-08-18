
'use client';
import React, { useEffect } from 'react';
import Notification from '@/components/notification';
import SideNav from '@/components/sidenav';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  const isAdmin = user?.role === 'admin';
  const isConfirmed = user?.email_confirmed === true;
  

  useEffect(() => {
    if (loading) return;

    // Not signed in → to login
    if (!user || !isAdmin || !isConfirmed ) {
      router.replace(`/login?next=${encodeURIComponent(path)}`);
      return;
    }

  }, [loading, user, isAdmin, isConfirmed, path, router]);

  if (loading) return <div className="p-6">Loading…</div>;
  // Avoid content flash while redirecting
  if (!user || !isAdmin || !isConfirmed) return null;

  return (

    <div className="flex">
      <SideNav />
      <div className="grow">
        <Notification />
        <div className=" p-[37px]">{children}</div>
      </div>
    </div>
  );
}
