import Navbar from '@/components/navbar';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LeBombusP',
  description: 'My personal website',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className + ' dark'}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
