'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../public/Logo.svg';

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
          isSelected ? 'text-teal-500' : 'text-blue-900'
        }`}
      >
        {title}
      </Link>
    </li>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Image src={Logo} alt="Logo" width={80} height={80} className="mr-2" />
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
              href="/login"
              className={`font-medium ${
                pathname === '/login' ? 'text-teal-500' : 'text-blue-900'
              }`}
            >
              Login
            </Link>
            <Link
              href="/demo"
              className="px-4 py-2 rounded-full border-2 border-blue-400 text-blue-900 font-medium hover:bg-blue-50 transition"
            >
              Demo Gratis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
