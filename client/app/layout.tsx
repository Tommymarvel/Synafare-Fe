// app/layout.tsx
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import { Be_Vietnam_Pro } from 'next/font/google';
import type { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

// Load the font and expose it as a CSS variable
const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // pick the weights you need
  variable: '--font-be-vietnam-pro',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ToastContainer theme="light" />
      <html lang="en" className={beVietnam.variable}>
        <body className="font-sans">
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    </>
  );
}
