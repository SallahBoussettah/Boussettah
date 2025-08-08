"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  Sun,
  Moon,
  Palette,
  Eye,
  Download,
  Heart,
  Share2,
  Filter,
  Grid,
  List,
  Search,
  Calendar,
  Tag,
  ArrowUpRight,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Brush,
  Layers,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import Link from "next/link";

// Theme Toggle Component
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationOrigin, setAnimationOrigin] = useState({ x: 0, y: 0 });
  const [nextTheme, setNextTheme] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const newTheme = theme === "dark" ? "light" : "dark";
    setNextTheme(newTheme);
    setAnimationOrigin({ x: centerX, y: centerY });
    setIsAnimating(true);

    // Delay theme change until animation starts expanding
    setTimeout(() => {
      setTheme(newTheme);
    }, 400);

    // Reset animation state after completion
    setTimeout(() => {
      setIsAnimating(false);
      setNextTheme("");
    }, 1600);
  };

  if (!mounted) return null;

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
            rotate: theme === "dark" ? 180 : 0,
            scale: isAnimating ? [1, 0.8, 1] : 1,
          }}
          transition={{
            rotate: { duration: 0.6, ease: [0.21, 1, 0.81, 1] },
            scale: { duration: 0.3, ease: [0.21, 1, 0.81, 1] },
          }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
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
            boxShadow:
              theme === "dark"
                ? "0 0 20px rgba(148, 163, 184, 0.2)"
                : "0 0 20px rgba(71, 85, 105, 0.2)",
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
                nextTheme === "light" ? "bg-white" : "bg-black"
              }`}
              style={{
                left: animationOrigin.x,
                top: animationOrigin.y,
              }}
              initial={{
                width: 0,
                height: 0,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                width: "400vmax",
                height: "400vmax",
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
  );
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
          ease: "easeInOut",
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
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-slate-400/2 dark:bg-slate-600/2 rounded-full"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// Animated text component
function AnimatedText({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
  );
}

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Art", href: "/art" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-lg border-b border-slate-200/20 dark:border-slate-700/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={() => window.scrollTo(0, 0)}>
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
              <Link
                key={item.name}
                href={item.href}
                onClick={() => window.scrollTo(0, 0)}
              >
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
              <div
                className={`w-6 h-0.5 bg-black dark:bg-white mb-1 transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <div
                className={`w-6 h-0.5 bg-black dark:bg-white mb-1 transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <div
                className={`w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
            >
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.scrollTo(0, 0);
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="block py-3 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors duration-300 font-medium cursor-pointer"
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
  );
}

// Hero Section
function ArtHeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="pt-32 pb-20 px-6 relative overflow-hidden"
    >
      <motion.div style={{ y }} className="max-w-4xl mx-auto text-center">
        <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
          Art Gallery
        </AnimatedText>

        <AnimatedText
          delay={0.2}
          className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
        >
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-r from-black via-slate-600 to-black dark:from-white dark:via-slate-400 dark:to-white bg-[length:200%_100%] bg-clip-text text-transparent"
          >
            My Art
          </motion.span>
          <br />
          <span className="text-black dark:text-white">Collection</span>
        </AnimatedText>

        <AnimatedText
          delay={0.4}
          className="text-xl text-slate-600 dark:text-slate-300 mb-2 max-w-2xl mx-auto leading-relaxed"
        >
          A collection of my anime character drawings, created with passion
          using Paint Studio X on Android and now Paint Studio on PC with a
          graphics tablet.
        </AnimatedText>
      </motion.div>
    </motion.section>
  );
}

// Art Filter Component
function ArtFilter({
  activeFilter,
  setActiveFilter,
  viewMode,
  setViewMode,
}: {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
}) {
  const filters = [
    { name: "All Artwork", value: "all" },
    { name: "Character Portraits", value: "portrait" },
    { name: "Full Body", value: "fullbody" },
    { name: "Action Scenes", value: "action" },
    { name: "Sketches", value: "sketch" },
    { name: "Recent Work", value: "recent" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      {/* Search and View Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            placeholder="Search artwork..."
            className="pl-10 bg-white dark:bg-black border-slate-200 dark:border-slate-700"
          />
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setViewMode("grid")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Grid className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => setViewMode("masonry")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "masonry"
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <List className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((filter, index) => (
          <motion.button
            key={filter.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeFilter === filter.value
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// Art Card Component
function ArtCard({
  artwork,
  index,
  viewMode,
}: {
  artwork: any;
  index: number;
  viewMode: string;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(artwork.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className={`group bg-white dark:bg-black rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all duration-500 ${
        viewMode === "masonry" ? "break-inside-avoid mb-6" : ""
      }`}
    >
      {/* Art Image */}
      <div className="relative overflow-hidden">
        <div
          className={`${
            viewMode === "masonry" ? "aspect-[4/5]" : "aspect-square"
          } bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden`}
        >
          {/* Display actual image if available */}
          {artwork.imageUrl ? (
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to gradient background if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          
          {/* Animated background pattern */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
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
              <motion.button
                className="w-14 h-14 bg-white dark:bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="w-6 h-6 text-black dark:text-white" />
              </motion.button>

              <motion.button
                onClick={handleLike}
                className="w-14 h-14 bg-white dark:bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart
                  className={`w-6 h-6 ${
                    isLiked
                      ? "text-red-500 fill-current"
                      : "text-black dark:text-white"
                  }`}
                />
              </motion.button>

              <motion.button
                className="w-14 h-14 bg-white dark:bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Download className="w-6 h-6 text-black dark:text-white" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Art preview with floating elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 15 + index,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-6xl opacity-30"
            >
              <Palette className="w-16 h-16 text-white" />
            </motion.div>
          </div>

          {/* Floating art elements */}
          <motion.div
            className="absolute top-4 right-4 w-3 h-3 bg-slate-400/40 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
          />
          <motion.div
            className="absolute bottom-6 left-6 w-2 h-2 bg-slate-500/50 rounded-full"
            animate={{
              x: [0, 15, 0],
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
          />
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-white/90 dark:bg-black/90 text-black dark:text-white border border-white/20 dark:border-black/20"
          >
            {artwork.category}
          </motion.span>
        </div>

        {/* Featured Badge */}
        {artwork.featured && (
          <div className="absolute top-4 right-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
              className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 text-white fill-current" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Art Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-black dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors cursor-pointer mb-1">
              {artwork.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {artwork.medium || 'Digital Art'}
            </p>
          </div>
          <div className="text-purple-500 ml-4">
            <Palette className="w-6 h-6 text-slate-400 dark:text-slate-600" />
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed text-sm">
          {artwork.description || 'A beautiful piece of digital art.'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(artwork.tags || []).slice(0, 3).map((tag: string, tagIndex: number) => (
            <motion.span
              key={tagIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + tagIndex * 0.05 }}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              #{tag}
            </motion.span>
          ))}
          {(artwork.tags || []).length > 3 && (
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-xs font-medium">
              +{(artwork.tags || []).length - 3} more
            </span>
          )}
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{artwork.views || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{artwork.year || '2025'}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-1 text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white font-medium text-sm transition-colors"
          >
            <span>View Full</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Art Gallery Section
function ArtGallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedArt, setSelectedArt] = useState<number | null>(null);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/art?limit=50`);
        if (response.ok) {
          const data = await response.json();
          setArtworks(data.artPieces || []);
        } else {
          // Fallback to mock data if API fails
          setArtworks(mockArtworks);
        }
      } catch (error) {
        console.error("Error fetching artworks:", error);
        // Fallback to mock data
        setArtworks(mockArtworks);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const mockArtworks = [
    {
      title: "Sakura Warrior",
      medium: "Paint Studio on PC",
      description:
        "An anime warrior character surrounded by cherry blossoms, showcasing dynamic poses and detailed armor design.",
      category: "Character Portrait",
      tags: ["anime", "warrior", "sakura", "character"],
      year: "2025",
      likes: 142,
      views: "2.1K",
      featured: true,
      aspectClass: "aspect-[4/5]",
    },
    {
      title: "Mystic Mage",
      medium: "Paint Studio X",
      description:
        "A powerful anime mage character with flowing robes and magical energy effects, created during my early digital art journey.",
      category: "Full Body",
      tags: ["anime", "mage", "magic", "fantasy"],
      year: "2024",
      likes: 89,
      views: "1.8K",
      featured: false,
      aspectClass: "aspect-[3/4]",
    },
    {
      title: "Cyberpunk Heroine",
      medium: "Paint Studio on PC",
      description:
        "A futuristic anime character with cyberpunk aesthetics, featuring neon accents and high-tech accessories.",
      category: "Character Portrait",
      tags: ["anime", "cyberpunk", "futuristic", "neon"],
      year: "2025",
      likes: 203,
      views: "3.2K",
      featured: true,
      aspectClass: "aspect-[16/9]",
    },
    {
      title: "Forest Guardian",
      medium: "Paint Studio on PC",
      description:
        "An anime character with nature-themed design, surrounded by mystical forest elements and magical creatures.",
      category: "Full Body",
      tags: ["anime", "nature", "forest", "guardian"],
      year: "2025",
      likes: 156,
      views: "2.5K",
      featured: false,
      aspectClass: "aspect-[3/5]",
    },
    {
      title: "Character Study",
      medium: "Paint Studio X",
      description:
        "A detailed character study focusing on facial expressions and anime-style features, part of my skill development.",
      category: "Sketch",
      tags: ["anime", "study", "portrait", "practice"],
      year: "2024",
      likes: 78,
      views: "1.4K",
      featured: false,
      aspectClass: "aspect-square",
    },
    {
      title: "Dragon Summoner",
      medium: "Paint Studio on PC",
      description:
        "An epic anime character summoning a dragon, showcasing dynamic action poses and magical effects.",
      category: "Action Scene",
      tags: ["anime", "dragon", "action", "magic"],
      year: "2025",
      likes: 234,
      views: "4.1K",
      featured: true,
      aspectClass: "aspect-[5/3]",
    },
    {
      title: "School Uniform Design",
      medium: "Paint Studio on PC",
      description:
        "A classic anime school girl character with detailed uniform design and expressive pose.",
      category: "Character Portrait",
      tags: ["anime", "school", "uniform", "character"],
      year: "2025",
      likes: 167,
      views: "2.8K",
      featured: false,
      aspectClass: "aspect-[4/5]",
    },
    {
      title: "Ninja in Action",
      medium: "Paint Studio on PC",
      description:
        "A dynamic anime ninja character in mid-action, featuring traditional clothing with modern artistic interpretation.",
      category: "Action Scene",
      tags: ["anime", "ninja", "action", "traditional"],
      year: "2025",
      likes: 198,
      views: "3.5K",
      featured: true,
      aspectClass: "aspect-[3/4]",
    },
    {
      title: "Emotional Expression Study",
      medium: "Paint Studio X",
      description:
        "A series of anime character expressions exploring different emotions and facial features.",
      category: "Sketch",
      tags: ["anime", "emotions", "study", "expressions"],
      year: "2024",
      likes: 112,
      views: "1.9K",
      featured: false,
      aspectClass: "aspect-[4/3]",
    },
    {
      title: "Angel Wings",
      medium: "Paint Studio on PC",
      description:
        "An ethereal anime character with detailed angel wings, showcasing my progression in digital art techniques.",
      category: "Full Body",
      tags: ["anime", "angel", "wings", "ethereal"],
      year: "2025",
      likes: 289,
      views: "5.2K",
      featured: true,
      aspectClass: "aspect-[5/4]",
    },
    {
      title: "Casual Portrait",
      medium: "Paint Studio on PC",
      description:
        "A relaxed anime character in casual clothing, focusing on natural poses and everyday aesthetics.",
      category: "Character Portrait",
      tags: ["anime", "casual", "portrait", "relaxed"],
      year: "2025",
      likes: 145,
      views: "2.3K",
      featured: false,
      aspectClass: "aspect-[3/4]",
    },
    {
      title: "Underwater Scene",
      medium: "Paint Studio on PC",
      description:
        "An anime character in an underwater setting, exploring aquatic themes and flowing movement.",
      category: "Full Body",
      tags: ["anime", "underwater", "aquatic", "flowing"],
      year: "2025",
      likes: 176,
      views: "2.7K",
      featured: false,
      aspectClass: "aspect-[16/10]",
    },
  ];

  const filteredArtworks = loading ? [] : (
    activeFilter === "all"
      ? artworks
      : artworks.filter((artwork) => {
          if (activeFilter === "portrait") return artwork.category === "Character Portrait";
          if (activeFilter === "fullbody") return artwork.category === "Character Portrait";
          if (activeFilter === "action") return artwork.category === "Concept Art";
          if (activeFilter === "sketch") return artwork.category === "Illustration";
          if (activeFilter === "recent") return parseInt(artwork.year) >= 2024;
          return artwork.category === activeFilter;
        })
  );

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 text-center">
          Gallery
        </AnimatedText>
        <AnimatedText
          delay={0.2}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
        >
          <span className="bg-gradient-to-r from-black via-slate-600 to-black dark:from-white dark:via-slate-400 dark:to-white bg-clip-text text-transparent">
            My Anime Art Collection
          </span>
        </AnimatedText>

        <ArtFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Art Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6"
            }
          >
            <AnimatePresence mode="wait">
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={`${artwork.title}-${activeFilter}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ArtCard artwork={artwork} index={index} viewMode={viewMode} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button className="group bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 px-8 py-6 text-lg font-medium transition-all duration-300">
            Load More Artwork
            <motion.div
              className="ml-2"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// Call to Action Section
function CTASection() {
  return (
    <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedText className="text-4xl md:text-5xl font-bold mb-8">
          <span className="text-black dark:text-white">
            Let's Create Together
          </span>
        </AnimatedText>
        <AnimatedText
          delay={0.2}
          className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto"
        >
          Interested in commissioning custom anime character art or want to see
          more of my work? I'd love to bring your favorite characters to life
          through digital art.
        </AnimatedText>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link href="/#contact" onClick={() => window.scrollTo(0, 0)}>
            <Button className="group bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 px-8 py-6 text-lg font-medium transition-all duration-300">
              Commission Art
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>
          </Link>

          <Link href="/projects" onClick={() => window.scrollTo(0, 0)}>
            <Button
              variant="outline"
              className="group border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-8 py-6 text-lg font-medium transition-all duration-300"
            >
              <Palette className="w-5 h-5 mr-2" />
              View All Projects
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function ArtPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white overflow-x-hidden">
      <AmbientBackground />
      <Navigation />
      <ThemeToggle />

      <ArtHeroSection />
      <ArtGallery />
      <CTASection />
    </div>
  );
}
