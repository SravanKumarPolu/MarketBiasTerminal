import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AutoUpdate } from "@/components/AutoUpdate";
import { ServiceWorkerProvider } from "@/components/ServiceWorkerProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Bias India - Trade Smart. Trade Aligned.",
  description: "Get clear daily market bias for Indian markets with actionable context. Optimized for NIFTY 50 and BANK NIFTY.",
  keywords: ["NIFTY", "BANK NIFTY", "Indian stock market", "trading bias", "market analysis", "stock market analysis", "trading signals", "market sentiment"],
  authors: [{ name: "Daily Bias India" }],
  creator: "Daily Bias India",
  publisher: "Daily Bias India",
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
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://dailyindianbias.netlify.app/',
    siteName: 'Daily Bias India',
    title: 'Daily Bias India - Trade Smart. Trade Aligned.',
    description: 'Get clear daily market bias for Indian markets with actionable context. Optimized for NIFTY 50 and BANK NIFTY.',
    images: [
      {
        url: 'https://dailyindianbias.netlify.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Daily Bias India - Market Analysis Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Bias India - Trade Smart. Trade Aligned.',
    description: 'Get clear daily market bias for Indian markets with actionable context.',
    images: ['https://dailyindianbias.netlify.app/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://dailyindianbias.netlify.app/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#2563eb' },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerProvider>
          <ErrorBoundary>
            <Navigation />
            {children}
            <Footer />
            <AutoUpdate showButton={true} autoCheck={true} checkInterval={5} />
            <Toaster />
          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "Daily Bias India",
                "description": "Get clear daily market bias for Indian markets with actionable context. Optimized for NIFTY 50 and BANK NIFTY.",
                "url": "https://dailyindianbias.netlify.app/",
                "applicationCategory": "FinanceApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "INR"
                },
                "creator": {
                  "@type": "Organization",
                  "name": "Daily Bias India",
                  "url": "https://dailyindianbias.netlify.app/"
                }
              })
            }}
          />
          </ErrorBoundary>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
