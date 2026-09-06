import type { Metadata } from 'next';
import './globals.css';

import { AuthProvider } from '@/context/AuthContext';
import LayoutWrapper from '@/components/Layout/LayoutWrapper';

export const metadata: Metadata = {
  title: 'TerraAlert',
  description: 'AI Landslide Monitoring Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <AuthProvider>

          <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-500" />

          <LayoutWrapper>
            {children}
          </LayoutWrapper>

        </AuthProvider>
      </body>
    </html>
  );
}