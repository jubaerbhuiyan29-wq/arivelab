'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function JoinNowSection() {
  console.log('JoinNowSection: Component called')
  
  const [stats, setStats] = useState([
    { label: "Research Projects", value: "50+" },
    { label: "Team Members", value: "25+" },
    { label: "Innovation Awards", value: "15+" }
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('JoinNowSection: useEffect running...')
    // For now, using static stats - could be fetched from API later
    setLoading(false)
  }, [])

  console.log('JoinNowSection: Rendering with loading:', loading)

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Join Our Innovation Journey</h2>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Be part of a team that's shaping the future of automotive technology through groundbreaking research and collaborative innovation.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <Link href="/register">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 text-lg">
            Join Now
          </Button>
        </Link>
      </div>
    </section>
  )
}