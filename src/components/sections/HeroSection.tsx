'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface HomepageSettings {
  heroTitle: string
  heroSubtitle: string
  heroCtaText: string
  heroCtaLink: string
  bannerImage?: string | null
  bannerVideo?: string | null
}

export default function HeroSection() {
  // Static fallback data for instant loading
  const [settings, setSettings] = useState<HomepageSettings>({
    heroTitle: "Welcome to Arive Lab",
    heroSubtitle: "Innovating the Future of Automotive Research",
    heroCtaText: "Join Now",
    heroCtaLink: "/register",
    bannerImage: null,
    bannerVideo: null
  })
  const [loading, setLoading] = useState(false) // Start with false for instant render
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [particles, setParticles] = useState<Array<{left: number, top: number, color: number, yEnd: number, duration: number, delay: number}>>([])
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate particles only on client side to prevent hydration mismatch
    const generatedParticles = [...Array(15)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: Math.random() * 60 + 200,
      yEnd: -Math.random() * 100 - 50,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 1
    }))
    setParticles(generatedParticles)
  }, [])

  useEffect(() => {
    // Load data in background after initial render
    const loadData = async () => {
      try {
        console.log('HeroSection: Fetching data from API...')
        const response = await fetch('/api/homepage')
        const data = await response.json()
        console.log('HeroSection: API data received:', data)
        setSettings(data)
      } catch (error) {
        console.error('HeroSection: Error fetching homepage settings:', error)
        // Keep using fallback data
      }
    }
    
    // Small delay to ensure initial render is fast
    const timer = setTimeout(loadData, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({ 
          x: e.clientX - rect.left, 
          y: e.clientY - rect.top 
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // No loading check - render immediately with fallback data

  return (
    <section 
      ref={heroRef}
      className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden"
    >
      {/* Simplified background for faster loading */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Simple mouse-following effect */}
        <div 
          className="absolute inset-0 transition-all duration-200 ease-out"
          style={{
            background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, 
              rgba(59, 130, 246, 0.1) 0%, 
              rgba(0, 0, 0, 0) 100%)`
          }}
        />
        
        {/* Minimal particle system - reduced to 15 */}
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                background: `hsl(${particle.color}, 70%, 60%)`,
              }}
              animate={{
                y: [0, particle.yEnd],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Simple central glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full filter blur-[80px] opacity-10" />
        </div>
      </div>

      {/* Main content with enhanced animations */}
      <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Simplified title animation */}
          <motion.h3 
            className="text-7xl md:text-9xl lg:text-10xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-orbitron tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {settings.heroTitle || "Welcome to Arive Lab"}
          </motion.h3>
          
          {/* Simplified subtitle */}
          <motion.p 
            className="text-2xl md:text-3xl lg:text-4xl mb-16 text-gray-300 max-w-4xl mx-auto leading-relaxed font-rajdhani font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {settings.heroSubtitle || "Innovating the Future of Automotive Research"}
          </motion.p>
          
          {/* Simplified CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            <Link href={settings.heroCtaLink || "/register"}>
              <Button 
                size="lg" 
                className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-6 px-12 rounded-full text-xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 overflow-hidden font-orbitron tracking-wider"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {settings.heroCtaText || "Join Now"}
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Simple scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={() => {
          const nextSection = document.querySelector('section:nth-child(2)')
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-blue-400 text-sm font-medium tracking-wider font-orbitron">
            EXPLORE FURTHER
          </span>
          <div className="w-8 h-12 border-2 border-blue-400 rounded-full flex justify-center p-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

    </section>
  )
}