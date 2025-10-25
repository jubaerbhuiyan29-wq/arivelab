'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ArrowUpRight, Github, Linkedin, Twitter, Instagram } from 'lucide-react'

interface SocialLink {
  platform: string
  url: string
  icon: string
}

export default function FooterSection() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "Twitter", url: "https://twitter.com/arivelab", icon: "twitter" },
    { platform: "LinkedIn", url: "https://linkedin.com/company/arivelab", icon: "linkedin" },
    { platform: "GitHub", url: "https://github.com/arivelab", icon: "github" },
    { platform: "Instagram", url: "https://instagram.com/arivelab", icon: "instagram" }
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/social')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSocialLinks(data)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('FooterSection: Error fetching social links:', error)
        setLoading(false)
      })
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'twitter':
        return <Twitter className="w-5 h-5" />
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />
      case 'github':
        return <Github className="w-5 h-5" />
      case 'instagram':
        return <Instagram className="w-5 h-5" />
      default:
        return <ArrowUpRight className="w-5 h-5" />
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-t border-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Arive Lab</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Pioneering the future of automotive innovation through cutting-edge research, 
                collaborative breakthroughs, and sustainable technology solutions.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {getIconComponent(social.icon)}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></span>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/research", label: "Research" },
                  { href: "/projects", label: "Projects" },
                  { href: "/team", label: "Our Team" },
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Contact" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Resources */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></span>
                Resources
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/research", label: "Publications" },
                  { href: "/projects", label: "Case Studies" },
                  { href: "/team", label: "Careers" },
                  { href: "/contact", label: "Press Kit" },
                  { href: "/contact", label: "Support" }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></span>
                Get In Touch
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white hover:text-blue-400 transition-colors cursor-pointer">
                      info@arivelab.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white">Innovation District, Tech City</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © {currentYear} Arive Lab. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}