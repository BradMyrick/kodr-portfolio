import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "kodr.pro - Web3 Blockchain Architect & Founder",
  description: "Software engineering leader specializing in Layer 0/1 blockchain development, smart contracts, and Web3 security. US Army veteran and commercial diver turned Web3 founder.",
  keywords: ["blockchain", "web3", "rust", "solidity", "smart contracts", "layer 1", "oko blockchain"],
  authors: [{ name: "kodr.pro" }],
  openGraph: {
    title: "kodr.pro - Web3 Blockchain Architect",
    description: "Building Web3's Future | Veteran | Diver | Blockchain Architect",
    url: "https://kodr.pro",
    siteName: "kodr.pro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "kodr.pro - Web3 Blockchain Architect",
    description: "Building Web3's Future | Veteran | Diver | Blockchain Architect",
    creator: "@kodr_eth",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
