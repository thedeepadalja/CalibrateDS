import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

const BASE_URL = 'https://calibrateds.deepadalja.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  title: "CalibrateDS | Quality Control for Design Engineers",
  description: "The complete ecosystem to stop design drift. Your Figma design file is source code — scan Figma, generate typed React components, detect staleness in CI.",
  keywords: ["design system", "Figma", "React components", "design tokens", "design drift", "MCP", "CLI", "design engineering"],
  authors: [{ name: "Deep Adalja", url: "https://deepadalja.com" }],
  alternates: { canonical: BASE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "CalibrateDS | Quality Control for Design Engineers",
    description: "The complete ecosystem to stop design drift. Your Figma design file is source code.",
    url: BASE_URL,
    siteName: "CalibrateDS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CalibrateDS | Quality Control for Design Engineers",
    description: "The complete ecosystem to stop design drift. Your Figma design file is source code.",
    creator: "@deepadalja",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'CalibrateDS',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'macOS, Linux, Windows',
              url: 'https://calibrateds.deepadalja.com',
              description: 'A local-first design system compiler. Scans Figma files, generates typed React components, detects design drift in CI, and exposes live design context via MCP.',
              author: { '@type': 'Person', name: 'Deep Adalja', url: 'https://deepadalja.com' },
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              downloadUrl: 'https://www.npmjs.com/package/@calibrate-ds/cli',
              softwareVersion: '0.1.37',
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 4rem)', paddingTop: '4rem', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
