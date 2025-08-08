'use client'

import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { ArrowRight, Play, ExternalLink, Github, Sun, Moon, Code, Gamepad2, Smartphone, Globe, Database, Calendar, MapPin, Star, Eye, Download, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { projectsAPI } from '@/lib/api'

// Theme Toggle Component
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationOrigin, setAnimationOrigin] = useState({ x: 0, y: 0 })
  const [nextTheme, setNextTheme] = useState<string>('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return // Prevent multiple clicks during animation
    
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setNextTheme(newTheme)
    setAnimationOrigin({ x: centerX, y: centerY })
    setIsAnimating(true)
    
    // Delay theme change until animation starts expanding
    setTimeout(() => {
      setTheme(newTheme)
    }, 400)
    
    // Reset animation state after completion
    setTimeout(() => {
      setIsAnimating(false)
      setNextTheme('')
    }, 1600)
  }

  if (!mounted) return null

  return (
    <>
      <motion.button
        onClick={handleThemeToggle}
        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: [0.21, 1, 0.81, 1] }}
      >
        <motion.div
          animate={{ 
            rotate: theme === 'dark' ? 180 : 0,
            scale: isAnimating ? [1, 0.8, 1] : 1
          }}
          transition={{ 
            rotate: { duration: 0.6, ease: [0.21, 1, 0.81, 1] },
            scale: { duration: 0.3, ease: [0.21, 1, 0.81, 1] }
          }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.4, ease: [0.21, 1, 0.81, 1] }}
              >
                <Sun className="w-6 h-6 text-slate-400" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.4, ease: [0.21, 1, 0.81, 1] }}
              >
                <Moon className="w-6 h-6 text-slate-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: theme === 'dark' 
              ? '0 0 20px rgba(148, 163, 184, 0.2)' 
              : '0 0 20px rgba(71, 85, 105, 0.2)'
          }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>

      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <motion.div
              className={`absolute rounded-full ${
                nextTheme === 'light' ? 'bg-white' : 'bg-black'
              }`}
              style={{
                left: animationOrigin.x,
                top: animationOrigin.y,
              }}
              initial={{
                width: 0,
                height: 0,
                x: '-50%',
                y: '-50%',
              }}
              animate={{
                width: '400vmax',
                height: '400vmax',
              }}
              transition={{
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Ambient background animation
function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-slate-400/5 dark:bg-slate-600/5 rounded-full"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-400/3 dark:bg-slate-600/3 rounded-full"
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

// Animated text component
function AnimatedText({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 1, 0.81, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Art', href: '/art' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-lg border-b border-slate-200/20 dark:border-slate-700/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="text-2xl font-bold tracking-tight cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="bg-gradient-to-r from-black via-slate-600 to-black dark:from-white dark:via-slate-400 dark:to-white bg-clip-text text-transparent">
                SB.
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  className="text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors duration-300 font-medium relative group cursor-pointer"
                  whileHover={{ y: -2 }}
                >
                  {item.name}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </motion.div>
              </Link>
            ))}
            
            {/* Developer Button */}
            <Link href="/login">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + navItems.length * 0.1, duration: 0.6 }}
                className="ml-4"
              >
                <motion.button
                  className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300 text-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  For Developer
                </motion.button>
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`w-6 h-0.5 bg-black dark:bg-white mb-1 transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`} />
              <div className={`w-6 h-0.5 bg-black dark:bg-white mb-1 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`} />
              <div className={`w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`} />
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
            >
              {navItems.map((item, index) => (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="block py-3 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors duration-300 font-medium cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
              
              {/* Developer Button - Mobile */}
              <Link href="/login">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
                  className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <motion.button
                    className="w-full bg-black dark:bg-white text-white dark:text-black px-4 py-3 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300 text-center"
                    whileTap={{ scale: 0.95 }}
                  >
                    For Developer
                  </motion.button>
                </motion.div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

// Hero Section
function ProjectsHeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, 50])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="pt-32 pb-20 px-6 relative overflow-hidden"
    >
      <motion.div style={{ y }} className="max-w-4xl mx-auto text-center">
        <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
          Portfolio
        </AnimatedText>
        
        <AnimatedText delay={0.2} className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          <motion.span
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-r from-black via-slate-600 to-black dark:from-white dark:via-slate-400 dark:to-white bg-[length:200%_100%] bg-clip-text text-transparent"
          >
            My Projects
          </motion.span>
          <br />
          <span className="text-black dark:text-white">Showcase</span>
        </AnimatedText>
        
        <AnimatedText delay={0.4} className="text-xl text-slate-600 dark:text-slate-300 mb-2 max-w-2xl mx-auto leading-relaxed">
          A showcase of my work across web development, game development, and mobile applications. 
          Each project represents a unique challenge and creative solution.
        </AnimatedText>
      </motion.div>
    </motion.section>
  )
}

// Project Filter Component
function ProjectFilter({ activeFilter, setActiveFilter }: { activeFilter: string, setActiveFilter: (filter: string) => void }) {
  const filters = [
    { name: 'All', value: 'all' },
    { name: 'Web Development', value: 'web' },
    { name: 'Game Development', value: 'game' },
    { name: 'Mobile Apps', value: 'mobile' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex flex-wrap justify-center gap-4 mb-16"
    >
      {filters.map((filter, index) => (
        <motion.button
          key={filter.value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          onClick={() => setActiveFilter(filter.value)}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            activeFilter === filter.value
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {filter.name}
        </motion.button>
      ))}
    </motion.div>
  )
}

// Enhanced Project Card Component
function ProjectCard({ project, index }: { project: any, index: number }) {
  const getIcon = (category: string) => {
    switch (category) {
      case 'web':
        return <Globe className="w-6 h-6" />
      case 'game':
        return <Gamepad2 className="w-6 h-6" />
      case 'mobile':
        return <Smartphone className="w-6 h-6" />
      default:
        return <Code className="w-6 h-6" />
    }
  }

  const getColor = (category: string) => {
    switch (category) {
      case 'web':
        return 'text-blue-500'
      case 'game':
        return 'text-green-500'
      case 'mobile':
        return 'text-purple-500'
      default:
        return 'text-slate-500'
    }
  }

  const getBgGradient = (category: string) => {
    switch (category) {
      case 'web':
        return 'from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800'
      case 'game':
        return 'from-green-100 to-green-200 dark:from-green-900 dark:to-green-800'
      case 'mobile':
        return 'from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800'
      default:
        return 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group bg-white dark:bg-black rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all duration-500"
    >
      {/* Project Image */}
      <div className="relative overflow-hidden">
        <div className={`aspect-video bg-gradient-to-br ${getBgGradient(project.category)} relative`}>
          {/* Animated background pattern */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, ${project.category === 'web' ? '#3b82f6' : project.category === 'game' ? '#10b981' : '#8b5cf6'} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${project.category === 'web' ? '#1d4ed8' : project.category === 'game' ? '#059669' : '#7c3aed'} 0%, transparent 50%)`
            }}
          />
          
          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500 flex items-center justify-center"
            whileHover={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="flex space-x-4"
            >
              {/* View Details Button */}
              <Link href={`/project-detail/${project.slug}`}>
                <motion.div
                  className="w-14 h-14 bg-white dark:bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Eye className="w-6 h-6 text-black dark:text-white" />
                </motion.div>
              </Link>

              {/* Live Preview Button (for web projects) */}
              {project.liveUrl && project.category === 'web' && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-white dark:bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ExternalLink className="w-6 h-6 text-black dark:text-white" />
                </motion.a>
              )}

              {/* GitHub Button */}
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-white dark:bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="w-6 h-6 text-black dark:text-white" />
                </motion.a>
              )}

              {/* Play Button (for games) */}
              {project.category === 'game' && (
                <motion.button
                  className="w-14 h-14 bg-white dark:bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className="w-6 h-6 text-black dark:text-white ml-1" />
                </motion.button>
              )}
            </motion.div>
          </motion.div>
          
          {/* Category Icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className={`text-6xl font-bold opacity-30 ${getColor(project.category)}`}>
              {getIcon(project.category)}
            </div>
          </motion.div>
        </div>

        {/* Project Status Badge */}
        <div className="absolute top-4 left-4">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              project.status === 'completed' 
                ? 'bg-green-100/90 dark:bg-green-900/90 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700'
                : project.status === 'in-progress'
                ? 'bg-yellow-100/90 dark:bg-yellow-900/90 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700'
                : 'bg-blue-100/90 dark:bg-blue-900/90 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
            }`}
          >
            {project.status === 'completed' ? 'Completed' : project.status === 'in-progress' ? 'In Progress' : 'Planning'}
          </motion.span>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
              className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
            >
              <Star className="w-4 h-4 text-yellow-800 fill-current" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link href={`/project-detail/${project.slug}`}>
              <h3 className="text-xl font-bold text-black dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors cursor-pointer mb-1">
                {project.title}
              </h3>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {project.subtitle}
            </p>
          </div>
          <div className={`${getColor(project.category)} ml-4`}>
            {getIcon(project.category)}
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed text-sm">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech: string, techIndex: number) => (
            <motion.span
              key={techIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + techIndex * 0.05 }}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {tech}
            </motion.span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-xs font-medium">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* Project Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{project.year}</span>
            </div>
            {project.stars && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>{project.stars}</span>
              </div>
            )}
            {project.downloads && (
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>{project.downloads}</span>
              </div>
            )}
          </div>
          
          <Link href={`/project-detail/${project.slug}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// Mobile App Card Component (Different aspect ratio)
function MobileAppCard({ project, index }: { project: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group bg-white dark:bg-black rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all duration-500"
    >
      {/* Mobile App Image - Portrait aspect ratio */}
      <div className="relative overflow-hidden">
        <div className="aspect-[9/16] max-h-80 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 relative mx-auto">
          {/* Phone mockup frame */}
          <div className="absolute inset-4 bg-black dark:bg-white rounded-3xl p-1">
            <div className="w-full h-full bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-2xl relative overflow-hidden">
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 30%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 70% 70%, #7c3aed 0%, transparent 50%)`
                }}
              />
              
              {/* App icon in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-4xl text-purple-500"
                >
                  <Smartphone className="w-12 h-12" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500 flex items-center justify-center"
            whileHover={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="flex space-x-4"
            >
              <Link href={`/project-detail/${project.slug}`}>
                <motion.div
                  className="w-14 h-14 bg-white dark:bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Eye className="w-6 h-6 text-black dark:text-white" />
                </motion.div>
              </Link>

              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-white dark:bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="w-6 h-6 text-black dark:text-white" />
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              project.status === 'completed' 
                ? 'bg-green-100/90 dark:bg-green-900/90 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700'
                : project.status === 'in-progress'
                ? 'bg-yellow-100/90 dark:bg-yellow-900/90 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700'
                : 'bg-blue-100/90 dark:bg-blue-900/90 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
            }`}
          >
            {project.status === 'completed' ? 'Completed' : project.status === 'in-progress' ? 'In Progress' : 'Planning'}
          </motion.span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link href={`/project-detail/${project.slug}`}>
              <h3 className="text-xl font-bold text-black dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors cursor-pointer mb-1">
                {project.title}
              </h3>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {project.subtitle}
            </p>
          </div>
          <div className="text-purple-500 ml-4">
            <Smartphone className="w-6 h-6" />
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed text-sm">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech: string, techIndex: number) => (
            <motion.span
              key={techIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + techIndex * 0.05 }}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium"
            >
              {tech}
            </motion.span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-xs font-medium">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{project.year}</span>
            </div>
            {project.downloads && (
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>{project.downloads}</span>
              </div>
            )}
          </div>
          
          <Link href={`/project-detail/${project.slug}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1 text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm transition-colors"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// Projects Showcase Section
function ProjectsShowcase() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await projectsAPI.getAll({
          limit: 50,
          sortBy: 'priority',
          sortOrder: 'DESC'
        })
        setProjects(response.projects)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  const webFilteredProjects = filteredProjects.filter(p => p.category === 'web')
  const gameFilteredProjects = filteredProjects.filter(p => p.category === 'game')
  const mobileFilteredProjects = filteredProjects.filter(p => p.category === 'mobile')

  if (loading) {
    return (
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-black dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading projects...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 text-center">
          Portfolio
        </AnimatedText>
        <AnimatedText delay={0.2} className="text-4xl md:text-5xl font-bold mb-16 text-center text-black dark:text-white">
          Featured Projects
        </AnimatedText>

        <ProjectFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {/* Web Development Projects */}
        {(activeFilter === 'all' || activeFilter === 'web') && webFilteredProjects.length > 0 && (
          <div className="mb-20">
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-black dark:text-white mb-8 flex items-center"
            >
              <Globe className="w-6 h-6 text-blue-500 mr-3" />
              Web Development
            </motion.h3>
            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="wait">
                {webFilteredProjects.map((project, index) => (
                  <motion.div
                    key={project.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Game Development Projects */}
        {(activeFilter === 'all' || activeFilter === 'game') && gameFilteredProjects.length > 0 && (
          <div className="mb-20">
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-black dark:text-white mb-8 flex items-center"
            >
              <Gamepad2 className="w-6 h-6 text-green-500 mr-3" />
              Game Development
            </motion.h3>
            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="wait">
                {gameFilteredProjects.map((project, index) => (
                  <motion.div
                    key={project.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Mobile Apps Projects */}
        {(activeFilter === 'all' || activeFilter === 'mobile') && mobileFilteredProjects.length > 0 && (
          <div className="mb-20">
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-black dark:text-white mb-8 flex items-center"
            >
              <Smartphone className="w-6 h-6 text-purple-500 mr-3" />
              Mobile Applications
            </motion.h3>
            <motion.div 
              layout
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="wait">
                {mobileFilteredProjects.map((project, index) => (
                  <motion.div
                    key={project.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <MobileAppCard project={project} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}

// Stats Section
function StatsSection() {
  const stats = [
    { number: "25+", label: "Projects Completed", icon: Code },
    { number: "15K+", label: "Total Downloads", icon: Download },
    { number: "50+", label: "GitHub Stars", icon: Star },
    { number: "3", label: "Years Experience", icon: Calendar },
  ]

  return (
    <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 text-center">
          Achievements
        </AnimatedText>
        <AnimatedText delay={0.2} className="text-4xl md:text-5xl font-bold mb-16 text-center text-black dark:text-white">
          Project Statistics
        </AnimatedText>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="text-center bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <stat.icon className="w-8 h-8 text-blue-500" />
              </motion.div>
              <motion.div
                className="text-4xl font-bold text-black dark:text-white mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                viewport={{ once: true }}
              >
                {stat.number}
              </motion.div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Call to Action Section
function CTASection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedText className="text-4xl md:text-5xl font-bold mb-8 text-black dark:text-white">
          Let's Build Something Amazing
        </AnimatedText>
        <AnimatedText delay={0.2} className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
          Have a project in mind? I'm always excited to work on new challenges and bring innovative ideas to life.
        </AnimatedText>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link href="/#contact">
            <Button 
              className="group bg-black dark:bg-white text-white dark:text-black px-8 py-6 text-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300"
            >
              Start a Project
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>
          </Link>
          
          <Link href="/about">
            <Button 
              variant="outline"
              className="group border-2 border-black dark:border-white text-black dark:text-white px-8 py-6 text-lg font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
            >
              <Eye className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function ProjectsPage() {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white overflow-x-hidden">
      <AmbientBackground />
      <Navigation />
      <ThemeToggle />
      
      <ProjectsHeroSection />
      <ProjectsShowcase />
      <StatsSection />
      <CTASection />
    </div>
  )
}
