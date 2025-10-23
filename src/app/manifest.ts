import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Daily Bias India - Market Analysis Platform',
    short_name: 'Daily Bias India',
    description: 'Get clear daily market bias for Indian markets with actionable context. Optimized for NIFTY 50 and BANK NIFTY.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32 48x48',
        type: 'image/x-icon',
      },
      {
        src: '/icon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/icon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
