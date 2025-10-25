'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { usePathname } from 'next/navigation'
import { Menu, Home, Search, Users, Info, Mail, HelpCircle, FileText } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Research', href: '/research', icon: Search },
    { name: 'Project', href: '/projects', icon: Search },
    { name: 'Our Team', href: '/team', icon: Users },
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'Contact Us', href: '/contact', icon: Mail },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Terms', href: '/terms', icon: FileText },
  ]

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? 'bg-[#1a0d2e]/90 backdrop-blur-xl border-b border-[#8b5cf6]/30 shadow-lg shadow-[#8b5cf6]/10' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Side - Hamburger Menu */}
            <div className="flex-shrink-0">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-purple-400 bg-[#1a0d2e] hover:text-[#8b5cf6] hover:bg-[#8b5cf6]/5 transition-all duration-500 electric-hamburger-menu"
                  >
                    <Menu className="w-6 h-6 electric-menu-icon" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="left" 
                  className="w-80 bg-[#1a0d2e]/98 backdrop-blur-2xl border-r border-[#8b5cf6]/40 text-purple-100/90 p-0 electric-menu-panel-future"
                >
                  <div className="flex flex-col h-full">
                    {/* Menu Header */}
                    <div className="flex items-center justify-between p-6 border-b border-[#8b5cf6]/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#8b5cf6] rounded-full flex items-center justify-center future-logo-core">
                          <span className="text-purple-200 text-lg font-bold tracking-wider">A</span>
                        </div>
                        <div>
                          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]">
                            ARIVE LAB
                          </span>
                          <div className="text-xs text-purple-400/80 font-light tracking-wider">
                            FUTURE INNOVATION
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto">
                      <nav className="p-6">
                        {navItems.map((item) => (
                          <div key={item.name} className="mb-3">
                            <Link
                              href={item.href}
                              onClick={() => setIsMenuOpen(false)}
                              className={`flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-500 electric-menu-item-future ${
                                pathname === item.href
                                  ? 'bg-gradient-to-r from-[#8b5cf6]/20 to-[#7c3aed]/20 border-l-4 border-[#8b5cf6] text-purple-200'
                                  : 'text-purple-200/60 hover:bg-[#8b5cf6]/8 hover:text-purple-100'
                              }`}
                            >
                              <item.icon className="w-6 h-6 menu-icon-future transition-all duration-500" />
                              <span className="font-medium menu-text-future tracking-wide transition-all duration-500">{item.name}</span>
                            </Link>
                          </div>
                        ))}
                      </nav>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Center - Glowing Logo */}
            <div className="flex items-center justify-center flex-1">
              <Link href="/" className="flex items-center space-x-2 group">
                {/* Logo Emblem */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#8b5cf6] rounded-full flex items-center justify-center future-logo-main">
                    <span className="text-purple-200 text-lg font-bold tracking-wider">A</span>
                  </div>
                  {/* Multi-layered electric aura */}
                  <div className="absolute inset-0 rounded-full bg-[#8b5cf6]/40 animate-pulse future-aura-1"></div>
                  <div className="absolute inset-0 rounded-full bg-[#7c3aed]/30 animate-ping future-aura-2"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8b5cf6]/20 to-[#7c3aed]/20 animate-pulse future-aura-3"></div>
                  {/* Electric field effect */}
                  <div className="absolute -inset-2 rounded-full border-2 border-[#8b5cf6]/30 animate-pulse future-field"></div>
                </div>
                
                {/* Logo Text */}
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[#8b5cf6] to-violet-500 group-hover:from-purple-300 group-hover:via-[#8b5cf6] group-hover:to-violet-400 transition-all duration-700 tracking-wider future-logo-text">
                    ARIVE LAB
                  </span>
                  <span className="text-xs text-purple-400/80 group-hover:text-purple-300 transition-colors duration-500 tracking-widest font-light future-logo-subtitle">
                    QUANTUM INNOVATION
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Side - Auth Buttons */}
            <div className="flex items-center space-x-6 flex-shrink-0">
              {/* Login Button - Minimal Electric */}
              <Link href="/login">
                <Button 
                  variant="outline"
                  className="border-purple-400/50 bg-[#1a0d2e] text-purple-400 hover:bg-purple-400/10 hover:text-purple-300 hover:border-purple-300 font-light py-2 px-6 rounded-full transition-all duration-500 electric-login-button-future tracking-wide"
                >
                  <span className="relative z-10">LOGIN</span>
                </Button>
              </Link>
              
              {/* Register Button - Bold Electric */}
              <Link href="/register">
                <Button 
                  className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-purple-400 hover:to-violet-600 bg-[#1a0d2e] text-purple-100 font-semibold py-2 px-8 rounded-full transition-all duration-500 electric-register-button-future tracking-wider shadow-lg shadow-[#8b5cf6]/30 hover:shadow-xl hover:shadow-[#8b5cf6]/50"
                >
                  <span className="relative z-10">REGISTER</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* Enhanced CSS for futuristic electric theme */}
      <style jsx global>{`
        /* Electric Hamburger Menu - Enhanced */
        .electric-hamburger-menu {
          position: relative;
          overflow: hidden;
          border-radius: 50%;
        }
        
        .electric-hamburger-menu::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
          transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .electric-hamburger-menu:hover::before {
          left: 100%;
        }
        
        .electric-hamburger-menu:hover {
          transform: scale(1.15) rotate(90deg);
          box-shadow: 
            0 0 25px rgba(139, 92, 246, 0.6),
            0 0 50px rgba(124, 58, 237, 0.4),
            inset 0 0 20px rgba(139, 92, 246, 0.2);
          background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
        }
        
        .electric-menu-icon {
          filter: drop-shadow(0 0 3px rgba(139, 92, 246, 0.6));
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .electric-hamburger-menu:hover .electric-menu-icon {
          filter: drop-shadow(0 0 8px rgba(139, 92, 246, 1));
          transform: scale(1.1);
        }

        /* Electric Menu Panel - Future Theme */
        .electric-menu-panel-future {
          animation: future-panel-flicker 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(135deg, 
            rgba(26, 13, 46, 0.98) 0%, 
            rgba(139, 92, 246, 0.05) 50%, 
            rgba(26, 13, 46, 0.98) 100%);
        }
        
        @keyframes future-panel-flicker {
          0%, 100% { 
            opacity: 1; 
            transform: translateX(0);
          }
          25% { 
            opacity: 0.95; 
            transform: translateX(-2px);
          }
          50% { 
            opacity: 1; 
            transform: translateX(0);
          }
          75% { 
            opacity: 0.98; 
            transform: translateX(1px);
          }
        }

        /* Future Logo Core */
        .future-logo-core {
          box-shadow: 
            0 0 30px rgba(139, 92, 246, 0.6),
            0 0 60px rgba(124, 58, 237, 0.4),
            inset 0 0 20px rgba(139, 92, 246, 0.3),
            inset 0 0 40px rgba(124, 58, 237, 0.2);
          border: 2px solid rgba(139, 92, 246, 0.5);
          animation: future-logo-pulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        @keyframes future-logo-pulse {
          0%, 100% { 
            box-shadow: 
              0 0 30px rgba(139, 92, 246, 0.6),
              0 0 60px rgba(124, 58, 237, 0.4),
              inset 0 0 20px rgba(139, 92, 246, 0.3),
              inset 0 0 40px rgba(124, 58, 237, 0.2);
            transform: scale(1);
          }
          50% { 
            box-shadow: 
              0 0 40px rgba(139, 92, 246, 0.8),
              0 0 80px rgba(124, 58, 237, 0.6),
              inset 0 0 30px rgba(139, 92, 246, 0.4),
              inset 0 0 50px rgba(124, 58, 237, 0.3);
            transform: scale(1.05);
          }
        }
        
        .future-logo-main {
          animation: future-logo-glow 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        @keyframes future-logo-glow {
          0%, 100% { 
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #8b5cf6 100%);
          }
          25% { 
            background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #7c3aed 100%);
          }
          50% { 
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #8b5cf6 100%);
          }
          75% { 
            background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #7c3aed 100%);
          }
        }
        
        .future-aura-1 {
          animation: future-aura-pulse-1 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        @keyframes future-aura-pulse-1 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.4;
          }
          50% { 
            transform: scale(1.3);
            opacity: 0.7;
          }
        }
        
        .future-aura-2 {
          animation: future-aura-pulse-2 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        @keyframes future-aura-pulse-2 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.5);
            opacity: 0.6;
          }
        }
        
        .future-aura-3 {
          animation: future-aura-pulse-3 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        @keyframes future-aura-pulse-3 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.2;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.5;
          }
        }
        
        .future-field {
          animation: future-field-pulse 6s linear infinite;
        }
        
        @keyframes future-field-pulse {
          0%, 100% { 
            opacity: 0.3;
            border-color: rgba(139, 92, 246, 0.3);
          }
          50% { 
            opacity: 0.6;
            border-color: rgba(124, 58, 237, 0.5);
          }
        }
        
        .future-logo-text {
          text-shadow: 
            0 0 20px rgba(139, 92, 246, 0.5),
            0 0 40px rgba(124, 58, 237, 0.3);
          animation: future-text-glow 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        @keyframes future-text-glow {
          0%, 100% { 
            filter: brightness(1);
          }
          50% { 
            filter: brightness(1.2);
          }
        }
        
        .future-logo-subtitle {
          text-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
          animation: future-subtitle-pulse 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        
        @keyframes future-subtitle-pulse {
          0%, 100% { 
            opacity: 0.8;
          }
          50% { 
            opacity: 1;
          }
        }

        /* Electric Menu Item - Future Enhanced */
        .electric-menu-item-future {
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }
        
        .electric-menu-item-future::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(139, 92, 246, 0.1) 15%, 
            rgba(139, 92, 246, 0.3) 50%, 
            rgba(124, 58, 237, 0.2) 85%, 
            transparent 100%);
          transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
        }
        
        .electric-menu-item-future:hover::before {
          left: 100%;
        }
        
        .electric-menu-item-future::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 4px;
          background: linear-gradient(90deg, 
            #8b5cf6 0%, 
            #7c3aed 25%, 
            #8b5cf6 50%, 
            #7c3aed 75%, 
            #8b5cf6 100%);
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
          box-shadow: 
            0 0 20px rgba(139, 92, 246, 0.8),
            0 0 40px rgba(124, 58, 237, 0.6),
            inset 0 0 15px rgba(139, 92, 246, 0.5);
          animation: future-circuit-flow 3s linear infinite;
        }
        
        .electric-menu-item-future:hover::after {
          width: 100%;
          animation: future-charge-surge 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes future-charge-surge {
          0% { 
            width: 0; 
            opacity: 0;
            filter: brightness(0.3) blur(2px);
          }
          30% { 
            opacity: 1;
            filter: brightness(1.5) blur(0px);
          }
          70% { 
            opacity: 1;
            filter: brightness(1.2) blur(0px);
          }
          100% { 
            width: 100%; 
            opacity: 1;
            filter: brightness(1) blur(0px);
          }
        }
        
        @keyframes future-circuit-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        
        .electric-menu-item-future:hover {
          transform: translateX(12px) scale(1.03);
          box-shadow: 
            0 0 35px rgba(139, 92, 246, 0.4),
            0 0 70px rgba(124, 58, 237, 0.2),
            inset 0 0 30px rgba(139, 92, 246, 0.1);
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.1) 0%, 
            rgba(124, 58, 237, 0.05) 100%);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
        }
        
        .menu-icon-future {
          filter: drop-shadow(0 0 5px rgba(139, 92, 246, 0.6));
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .electric-menu-item-future:hover .menu-icon-future {
          filter: drop-shadow(0 0 15px rgba(139, 92, 246, 1));
          transform: scale(1.2) rotate(8deg);
        }
        
        .menu-text-future {
          text-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .electric-menu-item-future:hover .menu-text-future {
          text-shadow: 
            0 0 20px rgba(139, 92, 246, 0.8),
            0 0 40px rgba(124, 58, 237, 0.4),
            0 0 60px rgba(139, 92, 246, 0.2);
          color: #8b5cf6;
          font-weight: 600;
        }

        /* Electric Login Button - Future */
        .electric-login-button-future {
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        
        .electric-login-button-future::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #8b5cf6, #7c3aed, #8b5cf6);
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.8);
        }
        
        .electric-login-button-future:hover::before {
          width: 100%;
          animation: future-login-charge 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes future-login-charge {
          0% { width: 0; opacity: 0.5; }
          50% { opacity: 1; }
          100% { width: 100%; opacity: 1; }
        }
        
        .electric-login-button-future:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 
            0 0 25px rgba(139, 92, 246, 0.4),
            0 0 50px rgba(124, 58, 237, 0.2),
            inset 0 0 20px rgba(139, 92, 246, 0.1);
          background: rgba(139, 92, 246, 0.05);
        }

        /* Electric Register Button - Future */
        .electric-register-button-future {
          position: relative;
          overflow: hidden;
        }
        
        .electric-register-button-future::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(139, 92, 246, 0.2) 20%, 
            rgba(124, 58, 237, 0.3) 50%, 
            rgba(139, 92, 246, 0.2) 80%, 
            transparent 100%);
          transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
        }
        
        .electric-register-button-future:hover::before {
          left: 100%;
        }
        
        .electric-register-button-future:hover {
          transform: translateY(-3px) scale(1.08);
          box-shadow: 
            0 0 40px rgba(139, 92, 246, 0.6),
            0 0 80px rgba(124, 58, 237, 0.4),
            0 0 120px rgba(139, 92, 246, 0.2),
            inset 0 0 30px rgba(139, 92, 246, 0.2);
        }
        
        .electric-register-button-future::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(0, 212, 255, 0.1) 0%, 
            rgba(11, 114, 255, 0.1) 100%);
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        
        .electric-register-button-future:hover::after {
          opacity: 1;
        }
      `}</style>
    </>
  )
}