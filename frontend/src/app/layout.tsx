import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ClientSupportWidget } from '@/components/ClientSupportWidget';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: {
    default: 'СтримКэш - Сервис донатов для стримеров',
    template: '%s | СтримКэш'
  },
  description: 'Российская платформа для приёма донатов стримерами. Красивые алерты, гибкие настройки, безопасные платежи. Начните получать поддержку от зрителей уже сегодня!',
  keywords: [
    'донаты',
    'стримеры',
    'twitch',
    'youtube',
    'стрим',
    'алерты',
    'донат алерты',
    'streamcash',
    'стримкэш',
    'платформа донатов',
    'российский сервис'
  ],
  authors: [{ name: 'StreamCash Team' }],
  creator: 'StreamCash',
  publisher: 'StreamCash',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://стримкэш.рф'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'СтримКэш - Сервис донатов для стримеров',
    description: 'Российская платформа для приёма донатов стримерами. Красивые алерты, гибкие настройки, безопасные платежи.',
    url: 'https://стримкэш.рф',
    siteName: 'СтримКэш',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'СтримКэш - Сервис донатов для стримеров',
    description: 'Российская платформа для приёма донатов стримерами. Красивые алерты, гибкие настройки, безопасные платежи.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    yandex: 'f5c0468707bf2cb1',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                  m[i].l=1*new Date();
                  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=103508060', 'ym');

              ym(103508060, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
            `,
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/103508060" style={{position:'absolute', left:'-9999px'}} alt="" />
          </div>
        </noscript>
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <ClientSupportWidget />
        </Providers>
      </body>
    </html>
  );
}
