import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI 마케팅 자동화 | Aberry',
  description:
    'AI가 콘텐츠 작성, 예약 게시, 성과 분석까지. 마케팅팀 1명으로 10채널 운영하기. 주 10시간을 1시간으로.',
  keywords: ['마케팅 자동화', 'AI 마케팅', '소셜 미디어 관리', '콘텐츠 자동화'],
  openGraph: {
    title: 'AI 마케팅 자동화 | Aberry',
    description: 'AI가 콘텐츠 작성, 예약 게시, 성과 분석까지. 마케팅팀 1명으로 10채널 운영하기.',
    url: 'https://marketing.aberry.ai',
    siteName: 'Aberry',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 마케팅 자동화 | Aberry',
    description: 'AI가 콘텐츠 작성, 예약 게시, 성과 분석까지.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="light">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
