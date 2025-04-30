'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';

type FooterLinkProps = {
  text: string;
  url: string;
};

function FooterLink({ text, url }: FooterLinkProps) {
  return (
    <Link href={url} className="transition hover:text-teal-500">
      {text}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#1E3A5F] text-white pt-10 px-8 pb-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">

        {/* Logo */}
        <div>
          <div className="flex items-center mb-4">
            <Image
              src="/LogoFooter.svg" // gunakan string path, bukan import static untuk SSR-safe
              alt="Logo"
              width={160}
              height={160}
              className="mr-2"
            />
          </div>
        </div>

        {/* Fitur */}
        <div>
          <h4 className="font-semibold mb-2">Fitur</h4>
          <ul className="space-y-1 text-gray-300">
            <li><FooterLink text="Pengelolaan Karyawan" url="#" /></li>
            <li><FooterLink text="Pengelolaan Jadwal Kerja" url="#" /></li>
            <li><FooterLink text="Pengelolaan Dokumen" url="#" /></li>
            <li><FooterLink text="Sistem Approval" url="#" /></li>
            <li><FooterLink text="Sistem Payroll" url="#" /></li>
          </ul>
        </div>

        {/* Alamat */}
        <div>
          <h4 className="font-semibold mb-2">Alamat</h4>
          <p className="text-gray-300">
            Jl. Seruni No.9, Lowokwaru, Kec. Lowokwaru, Kota Malang, Jawa Timur 65141
          </p>
        </div>

        {/* Kontak */}
        <div>
          <h4 className="font-semibold mb-2">Kontak</h4>
          <p className="flex items-center gap-2 text-gray-300">
            <FaPhone /> +62 864 2086 4208
          </p>
          <p className="flex items-center gap-2 text-gray-300 mt-1">
            <FaEnvelope /> cmlabshris@mail.com
          </p>
        </div>

        {/* Sosial Media */}
        <div>
          <h4 className="font-semibold mb-2">Sosial Media</h4>
          <div className="flex space-x-4 mt-1 text-xl">
            <Link href="#"><span className="text-white hover:text-blue-400"><FaLinkedin /></span></Link>
            <Link href="#"><span className="text-white hover:text-blue-400"><FaFacebook /></span></Link>
            <Link href="#"><span className="text-white hover:text-pink-400"><FaInstagram /></span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
