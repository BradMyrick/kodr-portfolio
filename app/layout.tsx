import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kodr.pro"),
  title: "kodr.pro - Web3 Builder",
  description:
    "Software engineering leader specializing in blockchain development, smart contracts, and Web3 security. US Army veteran and commercial diver turned Web3 founder.",
  keywords: [
    "blockchain",
    "web3",
    "rust",
    "solidity",
    "go",
    "smart contracts",
    "layer 1",
    "oko blockchain",
  ],
  authors: [{ name: "kodr.pro" }],
  openGraph: {
    title: "kodr.pro - Web3 Builder",
    description: "Building Web3's Future | Veteran | Diver | Blockchain",
    url: "https://kodr.pro",
    siteName: "kodr.pro",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/preview.png",
        alt: "kodr.pro – terminal-style Rust/Web3 portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "kodr.pro - Web3 Builder",
    description: "Building Web3's Future | Veteran | Diver | Blockchain",
    creator: "@kodr_pro",
    images: ["/preview.png"],
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
