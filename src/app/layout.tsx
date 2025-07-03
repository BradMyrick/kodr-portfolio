import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Concordia.io - Sync. Build. Succeed.",
  description: "Concordia.io is a next-generation innovation hub enabling real-time, AI-powered collaboration for distributed teams. Sync your ideas. Build together. Succeed.",
  keywords: "concordia, collaboration, AI, real-time, distributed teams, project management, ideation, innovation hub",
  authors: [{ name: "Concordia Team" }],
  creator: "Concordia.io",
  openGraph: {
    title: "Concordia.io - Sync. Build. Succeed.",
    description: "Next-generation innovation hub for real-time, AI-powered collaboration",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concordia.io - Sync. Build. Succeed.",
    description: "Next-generation innovation hub for real-time, AI-powered collaboration",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
