import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EPOCH Idle',
  description: 'Solana validator idle game. Process slots, earn Lamports, and advance Epochs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white font-pixel">
        {children}
      </body>
    </html>
  );
}






