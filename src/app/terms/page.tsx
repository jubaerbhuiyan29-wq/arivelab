'use client'

import { motion } from 'framer-motion'
import { FileText, Shield, Users, Globe, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function TermsOfService() {
  const sections = [
    {
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      title: "Acceptance of Terms",
      content: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      title: "Use License",
      content: "Permission is granted to temporarily download one copy of the materials on Arive Lab's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
    },
    {
      icon: <Users className="w-6 h-6 text-green-500" />,
      title: "User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password."
    },
    {
      icon: <Globe className="w-6 h-6 text-orange-500" />,
      title: "Intellectual Property",
      content: "All content included on this website, such as text, graphics, logos, images, and digital downloads is the property of Arive Lab or its content suppliers and protected by international copyright laws."
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "Limitation of Liability",
      content: "In no event shall Arive Lab or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-indigo-500" />,
      title: "Termination",
      content: "This agreement is effective until terminated by either party. You may terminate this agreement at any time by discontinuing your use of the website and destroying all materials obtained from this website."
    }
  ]

  const prohibitedActivities = [
    "Using the service for any illegal purposes",
    "Impersonating any person or entity",
    "Interfering with or disrupting the service",
    "Uploading or transmitting viruses or malicious code",
    "Collecting or harvesting user data without consent",
    "Engaging in any automated use of the system"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Please read these terms of service carefully before using our website and services.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="space-y-12">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{section.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Prohibited Activities</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800 font-medium mb-4">You may not access or use the service for any purpose other than that for which we make the service available. The service may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
                <ul className="space-y-2">
                  {prohibitedActivities.map((activity, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Disclaimer</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800 leading-relaxed">
                  The materials on Arive Lab's website are provided on an 'as is' basis. Arive Lab makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Governing Law</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Arive Lab operates and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Changes to Terms</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                We reserve the right, at our sole discretion, to modify or replace these Terms of Service by posting the updated terms on the website. Your continued use of the service after any such changes constitutes your acceptance of the new Terms of Service.
              </p>
              <p className="text-gray-600 leading-relaxed">
                It is your responsibility to review these Terms of Service periodically for changes. If you do not agree to any of the changes, you must stop using the service and terminate your account.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Back to Home */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}