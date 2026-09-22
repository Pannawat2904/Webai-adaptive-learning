import type { Metadata } from 'next';
import { IBM_Plex_Sans_Thai, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-ibm-plex-sans-thai',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
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
    <html lang="th" className={`${ibmPlexSansThai.variable} ${jetbrainsMono.variable} h-full antialiased font-sans scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased font-sans transition-colors selection:bg-blue-500/20 selection:text-blue-600">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
