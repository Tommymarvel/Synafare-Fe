// app/dashboard/components/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import BellIcon from '@/app/assets/bell.svg';
import Avatar from '@/app/assets/Avatar.png';
import ArrowDown from '@/app/assets/arrow-down.svg';
import { Settings, Headset, LogOut, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async () => {
    try {
      await axiosInstance.post('/auth/logout');

      router.push('/');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        (axiosError.response && axiosError.response.data
          ? axiosError.response.data.message || axiosError.response.data
          : axiosError.message || 'An error occurred'
        ).toString()
      );
    }
  };

  return (
    <div className="relative flex items-center justify-between w-full py-2 bg-white">
      {/* Hamburger button (mobile) */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-gray-800" />
      </button>

      {/* Spacer for desktop (hide hamburger) */}
      <div className="hidden md:block w-6" />

      {/* Right-side actions */}
      <div className="flex-1 flex justify-end items-center space-x-4">
        {/* Notifications */}
        {/* <button
          className="relative bg-gray-100 p-2 rounded-full hover:bg-gray-200"
          aria-label="Notifications"
        >
          <Image src={BellIcon} alt="bell" width={24} height={24} />
          <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-mikado" />
        </button> */}

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300 mx-4" />

        {/* Avatar + dropdown */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Image
              src={user?.avatar ? user.avatar : Avatar}
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full w-[32px] aspect-square object-cover"
            />
            <span className="text-sm text-gray-800 font-medium">
              {user?.first_name || 'User'}
            </span>
            <Image
              src={ArrowDown}
              alt="Expand"
              width={20}
              height={20}
              className="text-gray-600"
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 flex items-center space-x-3">
                <Image
                  src={user?.avatar ? user.avatar : Avatar}
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="rounded-full w-[40px] aspect-square object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.first_name || 'User'} {user?.last_name || ''}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="border-t">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Link>
                <Link
                  href="/support"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  <Headset className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
                <span
                  onClick={() => {
                    setMenuOpen(false);
                    handleSubmit();
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <aside
            className="fixed top-0 left-0 h-full bg-white z-40"
            style={{
              width: sidebarOpen ? '80vw' : '0',
              transition: 'width 6s ease',
            }}
          >
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
          <div
            className="fixed top-0 left-[80vw] h-full w-[20vw] z-30 backdrop-blur-md"
            onClick={() => setSidebarOpen(false)}
          />
        </>
      )}
    </div>
  );
}
