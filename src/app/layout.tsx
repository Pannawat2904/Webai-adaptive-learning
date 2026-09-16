import type { Metadata } from 'next';
import { Prompt, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin', 'thai'],
  variable: '--font-prompt',
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ระบบการเรียนรู้แบบปรับเหมาะเฉพาะบุคคล เรื่อง โครงสร้างภาษา HTML',
  description: 'การพัฒนานวัตกรรมการเรียนรู้แบบปรับเหมาะเฉพาะบุคคลโดยบูรณาการพื้นที่จำลองการเขียนโค้ด เรื่อง โครงสร้างภาษา HTML เพื่อส่งเสริมทักษะทางวิชาชีพด้านการพัฒนาเว็บไซต์ สำหรับนักเรียนระดับชั้นประกาศนียบัตรวิชาชีพ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${prompt.variable} ${inter.variable} h-full antialiased font-sans scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased bg-slate-50 dark:bg-slate-900 font-sans transition-colors selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
