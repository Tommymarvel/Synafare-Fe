'use client';
import Image from 'next/image';
import InfoDetail from '../loan-requests/[id]/components/detail';
import EditProfileMdoal from './components/modals/edit-profile';
import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const ProfileSettings = () => {
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [password, setPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, refreshUser } = useAuth();

  const handleChangePassword = async (pw: string) => {
    if (!pw.trim()) {
      toast.error('Please enter a password');
      return;
    }
    
    try {
      await axiosInstance.patch('/update-pw', { 'new-pw': pw });
      toast.success('Password changed successfully');
      setPassword(''); // Clear the password field
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while trying to change your password');
    }
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await axiosInstance.patch('/auth/setup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(
        (data as { message?: string })?.message ||
          'Profile photo updated successfully'
      );

      // Refresh user data to get the new avatar URL
      if (typeof refreshUser === 'function') {
        await refreshUser();
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string } | string>;
      const respData = axiosError.response?.data;
      const msg =
        (typeof respData === 'string' ? respData : respData?.message) ||
        axiosError.message ||
        'Failed to update profile photo';
      toast.error(msg);
    } finally {
      setIsUploadingPhoto(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const Fallback = '---';
  const firstName = user?.first_name || Fallback;
  const lastName = user?.last_name || Fallback;
  const role = user?.role || Fallback;
  const email = user?.email || Fallback;
  const phone = user?.phn_no || Fallback;
  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || Fallback;
  return (
    <>
      <EditProfileMdoal
        open={editProfileModal}
        onOpenChange={setEditProfileModal}
      />
      <h1 className="text-lg font-medium mb-[13px]">Profile</h1>
      <div className="space-y-6">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        <div className="rounded-lg border border-gray p-[18px] w-full">
          <div className="flex gap-x-[13px] items-center">
            <div className="relative">
              <Image
                width={73}
                height={73}
                src={user?.avatar || "/avatar.jpg"}
                className="rounded-full w-[73px] aspect-square object-cover"
                alt="Your profile picture"
              />
              <button
                onClick={triggerPhotoUpload}
                disabled={isUploadingPhoto}
                className={`flex items-center justify-center w-[25px] h-[25px] bg-mikado-yellow rounded-full absolute right-0 bottom-0 hover:bg-yellow-500 transition-colors ${
                  isUploadingPhoto
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
                title="Change profile photo"
              >
                {isUploadingPhoto ? (
                  <div className="w-3 h-3 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
                    <path
                      d="M2.53422 12.2341H13.7475C15.0827 12.2341 15.7874 11.5417 15.7874 10.2189V3.72828C15.7874 2.40543 15.0827 1.71309 13.7475 1.71309H12.06C11.5778 1.71309 11.4233 1.63273 11.1204 1.31747L10.632 0.792043C10.3106 0.452058 9.98298 0.285156 9.35246 0.285156H6.89839C6.26787 0.285156 5.94643 0.452058 5.61881 0.792043L5.13046 1.31747C4.83375 1.62655 4.67303 1.71309 4.19087 1.71309H2.53422C1.199 1.71309 0.500488 2.40543 0.500488 3.72828V10.2189C0.500488 11.5417 1.199 12.2341 2.53422 12.2341ZM2.61458 11.004C2.05206 11.004 1.73062 10.7072 1.73062 10.1076V3.83954C1.73062 3.24612 2.05206 2.9494 2.61458 2.9494H4.5494C5.10574 2.9494 5.39009 2.8505 5.70535 2.51051L6.17515 1.99126C6.52131 1.61419 6.70676 1.51528 7.25073 1.51528H9.00011C9.54409 1.51528 9.72953 1.61419 10.0695 1.98508L10.5455 2.51051C10.8608 2.8505 11.1451 2.9494 11.7014 2.9494H13.6672C14.2359 2.9494 14.5511 3.24612 14.5511 3.83954V10.1076C14.5511 10.7072 14.2359 11.004 13.6672 11.004H2.61458ZM8.14088 10.188C9.99534 10.188 11.4789 8.70442 11.4789 6.84377C11.4789 4.98313 9.99534 3.49956 8.14088 3.49956C6.29259 3.49956 4.80902 4.98313 4.80902 6.84377C4.80902 8.70442 6.29259 10.188 8.14088 10.188ZM11.6891 4.63078C11.6891 5.08203 12.0538 5.43438 12.4989 5.4282C12.9316 5.4282 13.2963 5.07585 13.2963 4.63078C13.2963 4.19807 12.9254 3.82718 12.4989 3.82718C12.0538 3.82718 11.6891 4.19807 11.6891 4.63078ZM8.14088 9.06295C6.92311 9.06295 5.92788 8.0739 5.92788 6.84377C5.92788 5.60747 6.91693 4.6246 8.14088 4.6246C9.371 4.6246 10.3601 5.60747 10.3601 6.84377C10.3601 8.0739 9.371 9.06295 8.14088 9.06295Z"
                      fill="#1D1C1D"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-lg">{displayName}</h4>
              <p className="text-mikado-yellow">{role}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray w-full">
          <div className="px-[18px] py-3 flex justify-between items-center border-b border-b-gray-4">
            <h4 className="text-lg font-medium">Personal Information</h4>
            <button
              onClick={() => setEditProfileModal(true)}
              className="flex gap-x-2 py-2 px-3 rounded-lg bg-mikado-yellow"
            >
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                <path
                  d="M13 18.9577H8.00002C3.47502 18.9577 1.54169 17.0243 1.54169 12.4993V7.49935C1.54169 2.97435 3.47502 1.04102 8.00002 1.04102H9.66669C10.0084 1.04102 10.2917 1.32435 10.2917 1.66602C10.2917 2.00768 10.0084 2.29102 9.66669 2.29102H8.00002C4.15835 2.29102 2.79169 3.65768 2.79169 7.49935V12.4993C2.79169 16.341 4.15835 17.7077 8.00002 17.7077H13C16.8417 17.7077 18.2084 16.341 18.2084 12.4993V10.8327C18.2084 10.491 18.4917 10.2077 18.8334 10.2077C19.175 10.2077 19.4584 10.491 19.4584 10.8327V12.4993C19.4584 17.0243 17.525 18.9577 13 18.9577Z"
                  fill="#1D1C1D"
                />
                <path
                  d="M7.58336 14.7424C7.07503 14.7424 6.60836 14.5591 6.26669 14.2258C5.85836 13.8174 5.68336 13.2258 5.77503 12.6008L6.13336 10.0924C6.20003 9.60911 6.51669 8.98411 6.85836 8.64245L13.425 2.07578C15.0834 0.417448 16.7667 0.417448 18.425 2.07578C19.3334 2.98411 19.7417 3.90911 19.6584 4.83411C19.5834 5.58411 19.1834 6.31745 18.425 7.06745L11.8584 13.6341C11.5167 13.9758 10.8917 14.2924 10.4084 14.3591L7.90003 14.7174C7.79169 14.7424 7.68336 14.7424 7.58336 14.7424ZM14.3084 2.95911L7.74169 9.52578C7.58336 9.68411 7.40003 10.0508 7.36669 10.2674L7.00836 12.7758C6.97503 13.0174 7.02503 13.2174 7.15003 13.3424C7.27503 13.4674 7.47503 13.5174 7.71669 13.4841L10.225 13.1258C10.4417 13.0924 10.8167 12.9091 10.9667 12.7508L17.5334 6.18411C18.075 5.64245 18.3584 5.15911 18.4 4.70911C18.45 4.16745 18.1667 3.59245 17.5334 2.95078C16.2 1.61745 15.2834 1.99245 14.3084 2.95911Z"
                  fill="#1D1C1D"
                />
                <path
                  d="M17.0417 8.19124C16.9833 8.19124 16.925 8.18291 16.875 8.16624C14.6833 7.54957 12.9417 5.80791 12.325 3.61624C12.2333 3.28291 12.425 2.94124 12.7583 2.84124C13.0917 2.74957 13.4333 2.94124 13.525 3.27457C14.025 5.04957 15.4333 6.45791 17.2083 6.95791C17.5417 7.04957 17.7333 7.39957 17.6417 7.73291C17.5667 8.01624 17.3167 8.19124 17.0417 8.19124Z"
                  fill="#1D1C1D"
                />
              </svg>
              Edit
            </button>
          </div>
          <div className="p-5 grid grid-cols-3 gap-y-[30px] justify-between">
            <InfoDetail title="First Name" value={firstName} />
            <InfoDetail title="Last Name" value={lastName} />
            <InfoDetail title="Role" value={role} />
            <InfoDetail title="Email Address" value={email} />
            <InfoDetail title="Phone Number" value={phone} />
          </div>
        </div>
        <div className="rounded-lg border border-gray w-full">
          <div className="px-[18px] py-3 flex justify-between items-center border-b border-b-gray-4">
            <h4 className="text-lg font-medium">Account Security</h4>
          </div>
          <div className="py-6 pb-10 px-5">
            <p className="font-medium">Password</p>
            <div className="flex gap-x-[51px] items-center ">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-5 px-4 bg-gray-100 border border-gray-300 w-full grow rounded-md"
                placeholder="Enter new password"
              />
              <button 
                onClick={() => handleChangePassword(password)}
                className="border shrink-0 border-resin-black py-2 px-4 rounded-lg hover:bg-deep-green hover:text-gray-4"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
