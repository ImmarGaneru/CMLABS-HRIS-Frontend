// src/app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';
import Layout2 from '@/components/Layout2';
import { AppContextProvider } from "@/contexts/AppContextProvider";

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
      <AppContextProvider>
          <Layout2>
              {children}
          </Layout2>
      </AppContextProvider>
      </body>
    </html>
  );

}