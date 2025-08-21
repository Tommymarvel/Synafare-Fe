import React from 'react';
import notFoundImage from '@/app/assets/404.svg';
import Image from 'next/image';

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white p-4'>
      <Image
       src={notFoundImage} alt="Not Found" />
    </div>
  );
}

export default NotFound;
