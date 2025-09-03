'use client';
import { Be_Vietnam_Pro } from 'next/font/google';
import { DM_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { RouteGuard } from '@/components/RouteGuard';
import { ToastContainer } from 'react-toastify';
import { usePathname } from 'next/navigation';

import './globals.css';

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-be-vietnam-pro',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

function ConditionalAuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't use AuthProvider for public auth pages
  const publicPaths = ['/login', '/mobile-blocked'];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <RouteGuard>{children}</RouteGuard>
    </AuthProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {' '}
      <ToastContainer theme="light" />
      <html lang="en">
        <body
          className={`${beVietnam.variable}  ${dmSans.variable} antialiased`}
        >
          <ConditionalAuthProvider>{children}</ConditionalAuthProvider>
        </body>
      </html>
    </>
  );
}
