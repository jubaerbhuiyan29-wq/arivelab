'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface LazySectionWrapperProps {
  children: React.ReactNode
  placeholder?: React.ReactNode
  threshold?: number
  rootMargin?: string
}

export default function LazySectionWrapper({ 
  children, 
  placeholder,
  threshold = 0.1,
  rootMargin = '100px'
}: LazySectionWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(ref)

    return () => {
      if (ref) {
        observer.unobserve(ref)
      }
    }
  }, [ref, threshold, rootMargin])

  return (
    <div ref={setRef}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {placeholder || (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}