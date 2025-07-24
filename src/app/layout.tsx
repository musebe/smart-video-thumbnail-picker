// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Thumbnail Picker',
  description: 'Upload videos and pick the perfect thumbnail.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='dark' suppressHydrationWarning>
      <body className={inter.className}>
        <main className='min-h-screen bg-background text-foreground'>
          {children}
        </main>
        <Toaster richColors position='top-right' />
      </body>
    </html>
  );
}
