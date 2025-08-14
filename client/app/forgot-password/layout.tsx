// app/auth/layout.tsx

import AuthNav from '../components/shared/AuthNav';

export default function ForgetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 1. Header */}
      <div className="w-full  mx-auto px-6 py-2 flex justify-between items-center border border-b-[#F0F2F5]">
        <AuthNav />
        
      </div>

      {/* 2. Centered form */}
      <main className="flex-grow flex items-center justify-center ">
        {children}
      </main>
    </div>
  );
}
