"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Properti navbar
type NavItemProps = {
  title: string;
  url: string;
  isSelected: boolean;
};

// Function untuk mengatur properti Navbar
function NavItem({ title, url, isSelected }: NavItemProps) {
  return (
    <li>
      <Link
        href={url}
        className={`block px-3 py-2 transition hover:text-[#7CA5BF] ${
          isSelected ? "text-[#7CA5BF]" : "text-[#1E3A5F]"
        }`}
      >
        {title}
      </Link>
    </li>
  );
}

// Fungsi Navbar utama
export default function Navbar() {
  const pathname = usePathname();
  const navLinks = [
    { title: "Beranda", url: "/" },
    { title: "Solusi", url: "/landing_page/solusi" },
    { title: "Harga", url: "/landing_page/harga" },
  ];

  return (
    <nav className="bg-[#f8f8f8] shadow-xl border-b-2 border-[#1E3A5F]/30">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/Logo.svg"
              alt="Logo"
              width={80}
              height={80}
              className="mr-2"
            />
          </div>

          {/* Menu */}
          <ul className="hidden md:flex space-x-10 font-medium">
            {navLinks.map((link) => (
              <NavItem
                key={link.url}
                title={link.title}
                url={link.url}
                isSelected={pathname === link.url}
              />
            ))}
          </ul>

          {/* Login & Demo Button */}
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login/email"
              className={`font-medium ${
                pathname === "/auth/login/email"
                  ? "text-[#7CA5BF]"
                  : "text-[#1E3A5F]"
              } hover:text-[#7CA5BF]`}
            >
              Login
            </Link>

            {/* Tombol Demo Gratis */}
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-[#7CA5BF] to-[#1E3A5F] rounded-[24px] p-1 text-white items-center"
            >
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
