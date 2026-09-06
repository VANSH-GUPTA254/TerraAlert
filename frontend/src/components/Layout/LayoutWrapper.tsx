'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { Footer } from '@/components/Footer';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const authPages = [
  '/login',
  '/register',
  '/forgot-password',
].includes(pathname);

  if (authPages) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-72 flex flex-col">
        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}