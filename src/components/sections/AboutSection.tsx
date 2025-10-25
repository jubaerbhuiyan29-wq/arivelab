'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface AboutData {
  title: string
  description: string
  image?: string | null
}

export default function AboutSection() {
  console.log('AboutSection: Component called')
  
  const [about, setAbout] = useState<AboutData>({
    title: "About Arive Lab",
    description: "Arive Lab is at the forefront of automotive research and innovation, pioneering the future of transportation through cutting-edge technology and groundbreaking research.",
    image: null
  })
  const [loading, setLoading] = useState(false) // Set to false initially

  useEffect(() => {
    console.log('AboutSection: useEffect running...')
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        console.log('AboutSection: API data received:', data)
        setAbout(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('AboutSection: Error fetching about data:', error)
        setLoading(false)
      })
  }, [])

  console.log('AboutSection: Rendering with loading:', loading)

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="text-center">
          <p>Loading about content...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">{about.title}</h2>
        </div>

        <Card className="bg-gray-900 border-gray-700 text-white">
          <CardContent className="p-8">
            <p className="text-xl text-gray-300 leading-relaxed">
              {about.description}
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {[
                { title: "Cutting-edge Research", icon: "🔬", description: "Pushing boundaries with innovative automotive research methodologies" },
                { title: "Innovative Technology", icon: "⚡", description: "Leveraging advanced technologies to revolutionize transportation" },
                { title: "Future of Transportation", icon: "🚗", description: "Shaping tomorrow's mobility solutions today" }
              ].map((feature, index) => (
                <div key={index} className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}