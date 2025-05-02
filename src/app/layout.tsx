// src/app/layout.tsx

import './globals.css';
import Navbar from './landing_page/navbar';
import Footer from './landing_page/footer';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CMLABS HRIS',
  description: 'Sistem informasi SDM modern dari CMLABS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
