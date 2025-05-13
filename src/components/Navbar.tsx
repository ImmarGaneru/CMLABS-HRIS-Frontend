'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type NavItemProps = {
  title: string;
  url: string;
  isSelected: boolean;
};

function NavItem({ title, url, isSelected }: NavItemProps) {
  return (
    <li>
      <Link
        href={url}
        className={`block px-3 py-2 transition hover:text-teal-500 ${
          isSelected ? 'text-teal-500' : 'text-[#1E3A5F]'
        }`}
      >
        {title}
      </Link>
    </li>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Cegah hydration error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hindari render saat SSR
  if (!isMounted) {
    return null;
  }

  return (
    <nav className="bg-[#f8f8f8] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Image src="/Logo.svg" alt="Logo" width={80} height={80} className="mr-2" />
          </div>

          {/* Menu */}
          <ul className="hidden md:flex space-x-10 font-medium">
            <NavItem title="Beranda" url="/" isSelected={pathname === '/'} />
            <NavItem title="Solusi" url="/solusi" isSelected={pathname === '/solusi'} />
            <NavItem title="Harga" url="/harga" isSelected={pathname === '/harga'} />
          </ul>

          {/* Login & Demo Button */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login/email"
              className={`font-medium ${
                pathname === '/login/email' ? 'text-teal-500' : 'text-[#1E3A5F]'
              }`}
            >
              Login
            </Link>

            {/* Tombol Demo Gratis */}
            <Link href="#" className="bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-[24px] p-1 text-white items-center">
              <span className="inline-block bg-white text-[#1E3A5F] rounded-[20px] px-6 py-2 text-sm font-medium">
                Demo Gratis
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}