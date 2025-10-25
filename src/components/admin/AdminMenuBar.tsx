'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserPlus, 
  Mail, 
  FileText, 
  Home, 
  Info, 
  Star, 
  FolderOpen, 
  Link2, 
  Shield, 
  Settings,
  Menu,
  X,
  ChevronDown
} from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  activeColor: string
  badge?: number
}

interface AdminMenuBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems: MenuItem[] = [
  {
    id: 'users',
    label: 'Users',
    icon: <Users className="w-5 h-5" />,
    color: 'text-blue-400',
    activeColor: 'bg-blue-600'
  },
  {
    id: 'registrations',
    label: 'Registrations',
    icon: <UserPlus className="w-5 h-5" />,
    color: 'text-purple-400',
    activeColor: 'bg-purple-600'
  },
  {
    id: 'team',
    label: 'Team',
    icon: <UserPlus className="w-5 h-5" />,
    color: 'text-cyan-400',
    activeColor: 'bg-cyan-600'
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: <Mail className="w-5 h-5" />,
    color: 'text-green-400',
    activeColor: 'bg-green-600'
  },
  {
    id: 'images',
    label: 'Images',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-yellow-400',
    activeColor: 'bg-yellow-600'
  },
  {
    id: 'homepage',
    label: 'Homepage',
    icon: <Home className="w-5 h-5" />,
    color: 'text-indigo-400',
    activeColor: 'bg-indigo-600'
  },
  {
    id: 'about',
    label: 'About',
    icon: <Info className="w-5 h-5" />,
    color: 'text-pink-400',
    activeColor: 'bg-pink-600'
  },
  {
    id: 'featured',
    label: 'Featured',
    icon: <Star className="w-5 h-5" />,
    color: 'text-orange-400',
    activeColor: 'bg-orange-600'
  },
  {
    id: 'content',
    label: 'Content',
    icon: <FolderOpen className="w-5 h-5" />,
    color: 'text-teal-400',
    activeColor: 'bg-teal-600'
  },
  {
    id: 'social',
    label: 'Social',
    icon: <Link2 className="w-5 h-5" />,
    color: 'text-lime-400',
    activeColor: 'bg-lime-600'
  },
  {
    id: 'legal',
    label: 'Legal',
    icon: <Shield className="w-5 h-5" />,
    color: 'text-red-400',
    activeColor: 'bg-red-600'
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: <Settings className="w-5 h-5" />,
    color: 'text-violet-400',
    activeColor: 'bg-violet-600'
  }
]

export default function AdminMenuBar({ activeTab, onTabChange }: AdminMenuBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Menu - Simple horizontal layout */}
      <div className="hidden md:block">
        <div className="bg-black/80 backdrop-blur-xl border border-gray-700 rounded-xl p-3 shadow-2xl">
          <div className="flex items-center justify-center">
            <div className="flex flex-wrap justify-center gap-2 max-w-6xl w-full">
              {menuItems.map((item) => (
                <motion.div key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    onClick={() => handleTabClick(item.id)}
                    className={`relative h-12 px-4 rounded-lg transition-all duration-300 ${
                      activeTab === item.id
                        ? `${item.activeColor} text-white shadow-lg`
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={activeTab === item.id ? 'text-white' : item.color}>
                        {item.icon}
                      </span>
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className={`ml-1 text-xs ${
                            activeTab === item.id 
                              ? 'bg-white/20 text-white' 
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Active indicator */}
                    {activeTab === item.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Hamburger with simple grid */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <div className="bg-black/80 backdrop-blur-xl border border-gray-700 rounded-xl p-3 shadow-2xl">
          <Button
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
              <span className="font-medium">
                {isMobileMenuOpen ? 'Close Menu' : 'Admin Menu'}
              </span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-300 ${
                isMobileMenuOpen ? 'rotate-180' : ''
              }`} 
            />
          </Button>
        </div>

        {/* Mobile Menu Grid */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-2 bg-black/80 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {menuItems.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={() => handleTabClick(item.id)}
                        className={`w-full h-16 flex flex-col items-center justify-center space-y-1 rounded-lg transition-all duration-300 ${
                          activeTab === item.id
                            ? `${item.activeColor} text-white shadow-lg`
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        <span className={activeTab === item.id ? 'text-white' : item.color}>
                          {item.icon}
                        </span>
                        <span className="text-xs font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={`absolute top-1 right-1 text-xs ${
                              activeTab === item.id 
                                ? 'bg-white/20 text-white' 
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}