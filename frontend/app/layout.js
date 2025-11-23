// Root Layout Component
// Wraps all pages with common layout and metadata

import './globals.css';

export const metadata = {
  title: 'Interview Practice Partner',
  description: 'AI-powered mock interview practice platform',
};

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          {children}
        </div>
      </body>
    </html>
  );
}

