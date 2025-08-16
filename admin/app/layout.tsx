import { Be_Vietnam_Pro } from 'next/font/google';
import { DM_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';


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
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    </>
  );
}
