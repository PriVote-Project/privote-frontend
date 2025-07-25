import { Background, Header, Providers } from '@/components/shared';
import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const satoshiRegular = localFont({
  src: './fonts/Satoshi-Regular.woff',
  variable: '--font-satoshi-regular',
  weight: '400'
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;
const imageUrl = `${baseUrl}/logo.svg`;

const title = 'Privote';
const titleTemplate = '%s | Privote';
const description = 'Privote: The all new way of voting through MACI';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: title,
    template: titleTemplate
  },
  description,
  openGraph: {
    title: {
      default: title,
      template: titleTemplate
    },
    description,
    images: [
      {
        url: imageUrl
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    images: [imageUrl],
    title: {
      default: title,
      template: titleTemplate
    },
    description
  },
  icons: {
    icon: '/logo.svg'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <script
          async
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        />
      </head>
      <body className={`${satoshiRegular.variable}`}>
        <Providers>
          <Background />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
