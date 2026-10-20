import './globals.css';
import ClientLayout from './client-layout';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Prince Holidays | Bus Tours & College Trips from Tamil Nadu',
  description:
    'Family holidays, college industrial visits, school trips and office tours — bus, hotel, food and sightseeing all planned for you. Simple pricing, safe travel, WhatsApp booking.',
  openGraph: {
    title: 'Prince Holidays | Bus Tours & College Trips from Tamil Nadu',
    description:
      'Family holidays, college industrial visits, school trips and office tours — bus, hotel, food and sightseeing all planned for you. Simple pricing, safe travel, WhatsApp booking.',
    type: 'website',
    images: ['/images/prince-holidays-hero-poster.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prince Holidays | Bus Tours & College Trips from Tamil Nadu',
    description:
      'Family holidays, college industrial visits, school trips and office tours — bus, hotel, food and sightseeing all planned for you. Simple pricing, safe travel, WhatsApp booking.',
    images: ['/images/prince-holidays-hero-poster.webp'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/images/prince-holidays-logo.png"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Caveat:wght@500;600&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
        {/* Hero poster (~1MB) — start downloading before hydration so its decode
            never collides with the very first scroll gestures on mobile. */}
        <link
          rel="preload"
          as="image"
          href="/images/prince-holidays-hero-poster.webp"
          fetchPriority="high"
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
