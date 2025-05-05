// src/app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import Layout2 from '@/components/Layout2';

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
        <Layout2>
            {children}
        </Layout2>
      </body>
    </html>
  );
}
