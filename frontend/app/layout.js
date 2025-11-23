// Root Layout Component
// Wraps all pages with common layout and metadata

import './globals.css';

export const metadata = {
  title: 'Interview Practice Partner',
  description: 'AI-powered mock interview practice platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {children}
        </div>
      </body>
    </html>
  );
}

