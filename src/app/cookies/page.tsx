'use client'

import { motion } from 'framer-motion'
import { Cookie, Shield, Settings, Eye, Database, Info } from 'lucide-react'
import Link from 'next/link'

export default function CookiesPolicy() {
  const cookieTypes = [
    {
      icon: <Settings className="w-6 h-6 text-blue-500" />,
      title: "Essential Cookies",
      description: "Necessary for the website to function properly and cannot be disabled.",
      examples: ["Session cookies", "Security cookies", "Load balancing cookies"],
      required: true
    },
    {
      icon: <Eye className="w-6 h-6 text-purple-500" />,
      title: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website.",
      examples: ["Google Analytics", "Hotjar", "Custom tracking scripts"],
      required: false
    },
    {
      icon: <Cookie className="w-6 h-6 text-green-500" />,
      title: "Functional Cookies",
      description: "Enable enhanced functionality and personalization.",
      examples: ["Language preferences", "Theme settings", "User preferences"],
      required: false
    },
    {
      icon: <Database className="w-6 h-6 text-orange-500" />,
      title: "Advertising Cookies",
      description: "Used to deliver relevant advertisements and track marketing campaigns.",
      examples: ["Google Ads", "Facebook Pixel", "Retargeting cookies"],
      required: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Learn about how we use cookies and similar technologies to enhance your browsing experience.
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

            <div className="mb-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Info className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide a better browsing experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We use cookies for various purposes, including:
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>To remember your preferences and settings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>To understand how you use our website</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>To improve our website performance and functionality</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>To provide personalized content and advertisements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">Types of Cookies We Use</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {cookieTypes.map((cookie, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className={`p-6 rounded-lg border-2 ${cookie.required ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        {cookie.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{cookie.title}</h4>
                        {cookie.required && (
                          <span className="inline-block px-2 py-1 text-xs font-medium text-blue-800 bg-blue-200 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{cookie.description}</p>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Examples:</p>
                      <ul className="space-y-1">
                        {cookie.examples.map((example, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Managing Cookies</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 leading-relaxed mb-4">
                  You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the cookie consent banner that appears when you first visit our website.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Most web browsers allow you to control cookies through their settings. However, if you choose to disable cookies, some features of our website may not function properly.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">To Enable Cookies:</h4>
                    <p className="text-sm text-gray-600">Check your browser's help section for specific instructions on enabling cookies.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">To Disable Cookies:</h4>
                    <p className="text-sm text-gray-600">You can block cookies by adjusting your browser settings or using privacy tools.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Third-Party Cookies</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may use third-party services that set cookies on your device. These third parties include analytics providers, advertising networks, and social media platforms. Each third-party service has its own privacy policy and cookie policy.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We are not responsible for the privacy practices of these third-party services. We encourage you to review the privacy policies of these third parties to understand how they collect and use your information.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Updates to This Policy</h3>
              <p className="text-gray-600 leading-relaxed">
                We may update this cookie policy from time to time to reflect changes in our use of cookies or for operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this website.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h3>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Cookie Policy, please contact us at privacy@arivelab.com or through our contact form.
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
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}