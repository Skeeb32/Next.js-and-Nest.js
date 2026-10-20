import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Next.js and Nest.js | Task lab', description: 'A full-stack TypeScript learning project.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
