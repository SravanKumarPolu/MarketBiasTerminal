import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
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
  keywords: ["NIFTY", "BANK NIFTY", "Indian stock market", "trading bias", "market analysis"],
  authors: [{ name: "Daily Bias India" }],
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
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
