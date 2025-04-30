// src/app/layout.tsx

import './globals.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { ReactNode } from 'react';

export const metadata = {
  title: 'CMLABS HRIS',
  description: 'Sistem informasi SDM modern dari CMLABS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
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
