// components/shared/AuthNav.tsx
import Image from 'next/image';
import logo from '@/app/assets/synafare-yellow.svg'; // StaticImageData
import Link from 'next/link';

export default function AuthNav() {
  return (
    <Link href="/">
      <Image
        src={logo}
        alt="Synafare Logo"
        className="h-[33px] w-[53px] md:h-[59px] md:w-[93px]"
        // you can also explicitly set width/height if you prefer:
        // width={53} height={33}
      />
    </Link>
  );
}
