import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { EmergencyBanner } from '@/components/EmergencyBanner';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'TerraAlert | AI-Based Landslide Early Warning & Risk Monitoring (SIH26001)',
  description: 'Production-ready AI landslide risk monitoring, early warning forecasting, crowd incident triage, and GIS spatial intelligence platform for Smart India Hackathon.',
  keywords: 'Landslide Early Warning, SIH26001, AI Disaster Management, NDMA, SDMA, IoT Telemetry, Slope Stability',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased font-sans">
        <AuthProvider>
          <EmergencyBanner />
          <Navbar />
          <main className="flex-1 bg-white">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
