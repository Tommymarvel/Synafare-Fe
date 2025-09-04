'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface InventoryLayoutProps {
  children: ReactNode;
}

export default function InventoryLayout({ children }: InventoryLayoutProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect installer users away from any inventory pages
  useEffect(() => {
    if (user?.nature_of_solar_business === 'installer') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  // Don't render anything for installer users
  if (user?.nature_of_solar_business === 'installer') {
    return null;
  }

  return <>{children}</>;
}
