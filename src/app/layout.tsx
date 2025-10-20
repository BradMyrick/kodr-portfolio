import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kodr.pro'),
  title: {
    default: "Kodr.pro - Unifying Polyglot Development Through WebAssembly",
    template: "%s | Kodr.pro"
  },
  description: "The first comprehensive polyglot development platform built on WebAssembly and Cap'n Proto RPC. Seamlessly integrate Rust, Go, Python, JavaScript, and more through a unified compilation pipeline and browser-based IDE.",
  keywords: [
    "WebAssembly",
    "WASM",
    "polyglot development",
    "polyglot programming",
    "Cap'n Proto RPC",
    "cross-language development",
    "Rust",
    "Go",
    "Python",
    "JavaScript",
    "browser IDE",
    "unified compilation",
    "edge computing",
    "web3 development",
    "high-performance web applications",
    "developer tools",
    "kodr",
    "kodr.pro"
  ],
  authors: [
    { name: "Kodr.pro Team", url: "https://kodr.pro" }
  ],
  creator: "Kodr.pro",
  publisher: "Kodr.pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kodr.pro",
    siteName: "Kodr.pro",
    title: "Kodr.pro - Unifying Polyglot Development Through WebAssembly",
    description: "Build high-performance polyglot applications with WebAssembly. Seamlessly integrate Rust, Go, Python, and JavaScript through our unified development platform.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kodr.pro - WebAssembly Polyglot Development Platform",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kodr.pro - Polyglot Development with WebAssembly",
    description: "The first comprehensive WASM-based platform for seamless cross-language development. Rust, Go, Python, JavaScript - unified.",
    images: ["/og-image.png"],
    creator: "@kodrpro",
    site: "@kodrpro",
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    // Add when ready:
    // google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://kodr.pro',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#06b6d4" />
        <link rel="canonical" href="https://kodr.pro" />
        {/* WebAssembly and polyglot development specific metadata */}
        <meta property="og:type" content="website" />
        <meta name="application-name" content="Kodr.pro" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
