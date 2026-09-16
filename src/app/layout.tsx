import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const notoSansThai = Noto_Sans_Thai({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  display: 'swap',
  variable: '--font-thai',
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
    <html lang="th" className={`${notoSansThai.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#07090e] dark:text-slate-100 transition-colors selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300 relative overflow-x-hidden">
        {/* Liquid Glass Ambient Background Glowing Orbs */}
        <div className="ambient-glow-1" aria-hidden="true" />
        <div className="ambient-glow-2" aria-hidden="true" />
        <div className="ambient-glow-3" aria-hidden="true" />

        <AuthProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
