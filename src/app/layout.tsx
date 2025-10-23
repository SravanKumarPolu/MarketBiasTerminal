import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
    url: 'https://dailybias.in',
    siteName: 'Daily Bias India',
    title: 'Daily Bias India - Trade Smart. Trade Aligned.',
    description: 'Get clear daily market bias for Indian markets with actionable context. Optimized for NIFTY 50 and BANK NIFTY.',
    images: [
      {
        url: '/og-image.jpg',
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
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://dailybias.in',
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
        <ErrorBoundary>
          <Navigation />
          {children}
          <Footer />
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
                "url": "https://dailybias.in",
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
                  "url": "https://dailybias.in"
                }
              })
            }}
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}
