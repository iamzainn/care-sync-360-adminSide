
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'CareSync 360 | Healthcare Services Provider',
    template: '%s | CareSync 360'
  },
  description: 'Access quality healthcare services across Pakistan with CareSync 360. Book lab tests, order medicines, connect with doctors, and access emergency services all in one platform.',
  keywords: [
    'healthcare',
    'Pakistan',
    'medical services',
    'lab tests',
    'medicine delivery',
    'doctor consultation',
    'emergency services'
  ],
  authors: [{ name: 'CareSync 360' }],
  creator: 'CareSync 360',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
