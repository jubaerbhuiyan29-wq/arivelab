import { Metadata } from "next"
import HeroSection from '@/components/sections/HeroSection'
import FeaturedSection from '@/components/sections/FeaturedSection'
import FeaturedProjectsSection from '@/components/sections/FeaturedProjectsSection'
import TeamSection from '@/components/sections/TeamSection'
import AboutSection from '@/components/sections/AboutSection'
import JoinNowSection from '@/components/sections/JoinNowSection'
import FooterSection from '@/components/sections/FooterSection'

// Generate dynamic metadata for homepage
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch homepage settings from API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/homepage`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch homepage settings');
    }
    
    const settings = await response.json();
    
    return {
      title: settings.seoTitle || "Arive Lab - Automotive Research Innovation",
      description: settings.seoDescription || "Leading the future of automotive research and innovation through cutting-edge technology and collaborative breakthroughs.",
      keywords: ["Arive Lab", "automotive research", "innovation", "technology", "automotive", "research", "future of transportation"],
      authors: [{ name: "Arive Lab Team" }],
      openGraph: {
        title: settings.seoTitle || "Arive Lab - Automotive Research Innovation",
        description: settings.seoDescription || "Leading the future of automotive research and innovation",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/`,
        siteName: "Arive Lab",
        type: "website",
      },
      twitter: {
        card: "summary_large_image" as const,
        title: settings.seoTitle || "Arive Lab - Automotive Research Innovation",
        description: settings.seoDescription || "Leading the future of automotive research and innovation",
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata
    return {
      title: "Arive Lab - Automotive Research Innovation",
      description: "Leading the future of automotive research and innovation through cutting-edge technology and collaborative breakthroughs.",
      keywords: ["Arive Lab", "automotive research", "innovation", "technology", "automotive", "research", "future of transportation"],
    };
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black scroll-smooth">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Research & Projects */}
      <FeaturedSection />
      
      {/* Featured Projects */}
      <FeaturedProjectsSection />
      
      {/* Leadership Team */}
      <TeamSection />
      
      {/* About Arive Lab */}
      <AboutSection />
      
      {/* Join Now CTA */}
      <JoinNowSection />
      
      {/* Footer */}
      <FooterSection />
    </div>
  )
}