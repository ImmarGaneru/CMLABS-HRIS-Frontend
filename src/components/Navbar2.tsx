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

import { FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';

export default function Navbar2({ username = "username", role = "HR" }) {
    const pathname = usePathname();
  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 border-b bg-white shadow-sm">
      {/* Logo / Title */}
      <h1 className="text-xl font-semibold text-[#1E3A5F]">Employee Database</h1>

      {/* Search Bar & Notification */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="search here"
            className="pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>

        <button className="p-2 rounded-md bg-[#B4CDE8] hover:bg-blue-300">
          <FaBell className="text-[#1E3A5F]" />
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-2">
          <FaUserCircle className="text-2xl text-[#1E3A5F]" />
          <div className="text-sm text-[#1E3A5F] leading-tight">
            <p className="font-medium">{username}</p>
            <p className="text-xs">{role}</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
