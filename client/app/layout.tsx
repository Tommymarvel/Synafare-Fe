// app/layout.tsx
'use client';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import { Be_Vietnam_Pro } from 'next/font/google';
import type { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation';

// Load the font and expose it as a CSS variable
const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // pick the weights you need
  variable: '--font-be-vietnam-pro',
});

function ConditionalAuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Don't use AuthProvider for public auth pages
  const publicPaths = ['/login', '/signup', '/forgot-password'];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return <>{children}</>;
  }

  return <AuthProvider>{children}</AuthProvider>;
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="toast-container"
        toastClassName="toast-item"
        progressClassName="toast-progress"
      />
      <html lang="en" className={beVietnam.variable}>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/synafare-yellow.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/synafare-yellow.svg" />
          <meta name="theme-color" content="#F5C842" />
        </head>
        <body className="font-sans">
          <ConditionalAuthProvider>{children}</ConditionalAuthProvider>
        </body>
      </html>
    </>
  );
}
