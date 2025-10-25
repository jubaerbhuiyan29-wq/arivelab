'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Database, Globe, Mail } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, fill out a form, or contact us. This may include your name, email address, phone number, and other personal information."
    },
    {
      icon: <Lock className="w-6 h-6 text-purple-500" />,
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about our products and services."
    },
    {
      icon: <Eye className="w-6 h-6 text-green-500" />,
      title: "Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy or as required by law."
    },
    {
      icon: <Database className="w-6 h-6 text-orange-500" />,
      title: "Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
    },
    {
      icon: <Globe className="w-6 h-6 text-red-500" />,
      title: "International Data Transfers",
      content: "Your information may be transferred to and maintained on servers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ."
    },
    {
      icon: <Mail className="w-6 h-6 text-indigo-500" />,
      title: "Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us at privacy@arivelab.com or through our contact form."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Your Rights</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Access and Update</h4>
                  <p className="text-gray-600">You have the right to access and update your personal information at any time.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Data Deletion</h4>
                  <p className="text-gray-600">You can request the deletion of your personal information from our systems.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Opt-out</h4>
                  <p className="text-gray-600">You can opt-out of receiving marketing communications from us.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Complaints</h4>
                  <p className="text-gray-600">You have the right to file complaints with data protection authorities.</p>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Changes to This Policy</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top.
              </p>
              <p className="text-gray-600 leading-relaxed">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
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
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}