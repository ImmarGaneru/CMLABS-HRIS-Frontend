/* eslint-disable @next/next/no-sync-scripts */
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
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""></script>
        <AppContextProvider>
          <Layout2>
            {children}
          </Layout2>
        </AppContextProvider>
      </body>
    </html>
  );

}