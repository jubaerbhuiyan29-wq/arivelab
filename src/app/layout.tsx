import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Default metadata for Arive Lab
const defaultMetadata = {
  title: "Arive Lab - Automotive Research Innovation",
  description: "Leading the future of automotive research and innovation through cutting-edge technology and collaborative breakthroughs.",
  keywords: ["Arive Lab", "automotive research", "innovation", "technology", "automotive", "research", "future of transportation"],
  authors: [{ name: "Arive Lab Team" }],
  openGraph: {
    title: "Arive Lab - Automotive Research Innovation",
    description: "Leading the future of automotive research and innovation",
    url: "https://arivelab.com",
    siteName: "Arive Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Arive Lab - Automotive Research Innovation",
    description: "Leading the future of automotive research and innovation",
  },
};

// Function to fetch SEO data from API
async function getSeoData(): Promise<Metadata> {
  try {
    // In a real implementation, you would fetch from your API
    // For now, we'll return the default metadata
    return defaultMetadata;
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return defaultMetadata;
  }
}

// Generate metadata for the root layout
export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSeoData();
  return seoData;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050814] text-foreground`}
      >
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
