import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "CalibrateDS | Quality Control for Design Engineers",
  description: "The complete ecosystem to stop design drift. Your Figma design file is source code.",
  openGraph: {
    title: "CalibrateDS | Quality Control for Design Engineers",
    description: "The complete ecosystem to stop design drift. Your Figma design file is source code.",
    url: "https://calibrateds.com",
    siteName: "CalibrateDS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CalibrateDS",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CalibrateDS | Quality Control for Design Engineers",
    description: "The complete ecosystem to stop design drift. Your Figma design file is source code.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 4rem)', paddingTop: '4rem', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
