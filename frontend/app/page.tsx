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
  Play,
  Mail,
  ArrowUpRight,
  Sun,
  Moon,
  Code,
  Gamepad2,
  Palette,
  ExternalLink,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import Link from "next/link";
import { projectsAPI, Project } from "@/lib/api";

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

            <motion.div
              className={`absolute rounded-full border-2 ${
                nextTheme === "light" ? "border-slate-200" : "border-slate-700"
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
                opacity: 0.8,
              }}
              animate={{
                width: "300vmax",
                height: "300vmax",
                opacity: 0,
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.1,
              }}
            />

            <motion.div
              className={`absolute rounded-full border ${
                nextTheme === "light" ? "border-slate-300" : "border-slate-600"
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
                opacity: 0.6,
              }}
              animate={{
                width: "200vmax",
                height: "200vmax",
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Loading Screen Component
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.21, 1, 0.81, 1] }}
      className="fixed inset-0 bg-white dark:bg-black z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.21, 1, 0.81, 1] }}
          className="mb-12"
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold tracking-tight"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(90deg, #000000, #64748b, #000000)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SB.
          </motion.h1>
        </motion.div>

        <div className="w-64 mx-auto">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-px bg-slate-200 dark:bg-slate-800 mb-4"
          >
            <motion.div
              className="h-full bg-black dark:bg-white origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-slate-500 dark:text-slate-400 font-light tracking-widest"
          >
            {progress}%
          </motion.p>
        </div>

        <motion.div
          className="absolute top-1/3 left-1/4 w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-slate-500 dark:bg-slate-500 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
        />
      </div>
    </motion.div>
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
      transition={{ delay: 1.2, duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-lg border-b border-slate-200/20 dark:border-slate-700/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="text-2xl font-bold tracking-tight"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <span className="bg-gradient-to-r from-black via-slate-600 to-black dark:from-white dark:via-slate-400 dark:to-white bg-clip-text text-transparent">
              SB.
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
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
                transition={{
                  delay: 1.4 + navItems.length * 0.1,
                  duration: 0.6,
                }}
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
  );
}

// Hero Section
function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <motion.section
      id="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      <motion.div style={{ y }} className="text-center z-10">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.21, 1, 0.81, 1] }}
          className="text-7xl md:text-8xl font-bold tracking-tight mb-8"
        >
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-r from-black via-slate-600 to-black dark:from-white dark:via-slate-400 dark:to-white bg-[length:200%_100%] bg-clip-text text-transparent"
          >
            SALAH EDDINE
          </motion.span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.21, 1, 0.81, 1] }}
          className="text-6xl md:text-7xl font-bold tracking-tight mb-8"
        ></motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 font-light tracking-wide"
        >
          Software Developer • Game Developer • Digital Artist
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link href="/projects">
            <Button className="group bg-black dark:bg-white text-white dark:text-black px-8 text-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300 h-[48px] flex items-center">
              View My Work
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>
          </Link>

          <a
            href="https://github.com/SallahBoussettah"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="group border-2 border-black dark:border-white text-black dark:text-white px-8 text-lg font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 h-[48px] flex items-center"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </a>
        </motion.div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500/60 rounded-full"
        initial={{ opacity: 0 }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
      />
      <motion.div
        className="absolute top-3/4 right-1/3 w-2 h-2 bg-green-500/60 rounded-full"
        initial={{ opacity: 0 }}
        animate={{
          y: [0, -15, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-1 h-1 bg-purple-500/60 rounded-full"
        initial={{ opacity: 0 }}
        animate={{
          y: [0, -10, 0],
          opacity: [0.4, 0.9, 0.4],
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 2.5 }}
      />
    </motion.section>
  );
}

// About Section
function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
            About
          </AnimatedText>
          <AnimatedText
            delay={0.2}
            className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-black dark:text-white"
          >
            Crafting digital experiences across multiple dimensions
          </AnimatedText>
          <AnimatedText
            delay={0.4}
            className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8"
          >
            I'm a multidisciplinary developer and artist who thrives at the
            intersection of technology and creativity. With expertise spanning
            web development, game development, and digital art, I bring a unique
            perspective to every project.
          </AnimatedText>
          <AnimatedText
            delay={0.6}
            className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8"
          >
            My passion lies in creating immersive digital experiences that not
            only function flawlessly but also tell compelling stories through
            code, interaction, and visual design.
          </AnimatedText>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
              <Code className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Web Development</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
              <Gamepad2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Game Development</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
              <Palette className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Digital Art</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.21, 1, 0.81, 1] }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-green-500/10 to-purple-500/10"
              animate={{
                rotate: [0, 5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-6xl font-bold text-slate-400/50 dark:text-slate-600/50"
              >
                SB
              </motion.div>
            </div>

            {/* Floating tech icons */}
            <motion.div
              className="absolute top-4 right-4 text-blue-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Code className="w-8 h-8" />
            </motion.div>
            <motion.div
              className="absolute bottom-4 left-4 text-green-500/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Gamepad2 className="w-8 h-8" />
            </motion.div>
            <motion.div
              className="absolute top-1/2 left-4 text-purple-500/30"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <Palette className="w-8 h-8" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Work Showcase Section
function WorkSection() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getFeatured(6);
        setFeaturedProjects(response.projects);
      } catch (error) {
        console.error("Error fetching featured projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  const allProjects = featuredProjects.map((project) => ({
    title: project.title || "Untitled Project",
    tech: Array.isArray(project.technologies)
      ? project.technologies.slice(0, 3).join(", ")
      : project.technologies || "",
    year: project.year || "2025",
    category: project.category || "web",
    slug: project.slug || "project",
  }));

  // Art gallery state
  const [selectedArt, setSelectedArt] = useState<number | null>(null);
  const [featuredArt, setFeaturedArt] = useState<any[]>([]);
  const [artLoading, setArtLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArt = async () => {
      try {
        setArtLoading(true);
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
          }/art?featured=true&limit=8`
        );
        if (response.ok) {
          const data = await response.json();
          setFeaturedArt(data.artPieces || []);
        } else {
          // Fallback to mock data if API fails
          setFeaturedArt([
            { title: "Abstract Dreams", slug: "abstract-dreams" },
            { title: "Digital Landscape", slug: "digital-landscape" },
            { title: "Neon Nights", slug: "neon-nights" },
            { title: "Cosmic Journey", slug: "cosmic-journey" },
            { title: "Urban Pulse", slug: "urban-pulse" },
            { title: "Nature's Code", slug: "natures-code" },
            { title: "Future Vision", slug: "future-vision" },
            { title: "Color Symphony", slug: "color-symphony" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching featured art:", error);
        // Fallback to mock data
        setFeaturedArt([
          { title: "Abstract Dreams", slug: "abstract-dreams" },
          { title: "Digital Landscape", slug: "digital-landscape" },
          { title: "Neon Nights", slug: "neon-nights" },
          { title: "Cosmic Journey", slug: "cosmic-journey" },
          { title: "Urban Pulse", slug: "urban-pulse" },
          { title: "Nature's Code", slug: "natures-code" },
          { title: "Future Vision", slug: "future-vision" },
          { title: "Color Symphony", slug: "color-symphony" },
        ]);
      } finally {
        setArtLoading(false);
      }
    };

    fetchFeaturedArt();
  }, []);

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 text-center">
          Featured Work
        </AnimatedText>
        <AnimatedText
          delay={0.2}
          className="text-4xl md:text-5xl font-bold mb-16 text-center text-black dark:text-white"
        >
          Web Development & Game Development
        </AnimatedText>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl mb-6"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {allProjects.map((project, index) => (
              <Link key={index} href={`/project-detail/${project.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
                      <motion.div
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-white/20 transition-all duration-500 flex items-center justify-center"
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                      >
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          className="w-16 h-16 bg-white dark:bg-black rounded-full flex items-center justify-center"
                        >
                          {project.category === "web" ? (
                            <ExternalLink className="w-6 h-6 text-black dark:text-white" />
                          ) : (
                            <Play className="w-6 h-6 text-black dark:text-white ml-1" />
                          )}
                        </motion.div>
                      </motion.div>

                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.02, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <div
                          className={`text-4xl font-bold ${
                            project.category === "web"
                              ? "text-blue-500/30"
                              : project.category === "game"
                              ? "text-green-500/30"
                              : "text-purple-500/30"
                          }`}
                        >
                          {project.category === "web" ? (
                            <Code className="w-12 h-12" />
                          ) : project.category === "game" ? (
                            <Gamepad2 className="w-12 h-12" />
                          ) : (
                            <Palette className="w-12 h-12" />
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <motion.h3
                    className="text-xl font-semibold mb-2 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors text-black dark:text-white"
                    layout
                  >
                    {project.title}
                  </motion.h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    {project.tech}
                  </p>
                  <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span className="capitalize">
                      {project.category} Development
                    </span>
                    <span>{project.year}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Link href="/projects">
            <Button className="group bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300">
              View All Projects
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>
          </Link>
        </motion.div>

        {/* Digital Art Section */}
        <AnimatedText className="text-4xl md:text-5xl font-bold mb-16 text-center text-black dark:text-white">
          Digital Art
        </AnimatedText>

        <div id="art" className="mt-20">
          {artLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredArt.map((artPiece, index) => (
                <motion.div
                  key={artPiece.id || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedArt(index)}
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl relative overflow-hidden">
                    {artPiece.imageUrl ? (
                      <img
                        src={artPiece.imageUrl}
                        alt={artPiece.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient background if image fails to load
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}



                    {/* Hover overlay with title */}
                    <motion.div
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/70 dark:group-hover:bg-black/70 transition-all duration-300 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.h3
                        className="text-white text-xl font-bold text-center px-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {artPiece.title}
                      </motion.h3>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Art Modal */}
        <AnimatePresence>
          {selectedArt !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedArt(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-black rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedArt(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 dark:hover:bg-white/40 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Art content */}
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
                  {/* Display actual artwork image */}
                  {featuredArt[selectedArt]?.imageUrl ? (
                    <img
                      src={featuredArt[selectedArt].imageUrl}
                      alt={featuredArt[selectedArt].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-slate-500 dark:text-slate-400">
                        <div className="text-6xl mb-4">🎨</div>
                        <p>No image available</p>
                      </div>
                    </div>
                  )}

                  {/* Floating elements for the modal */}
                  <motion.div
                    className="absolute top-1/4 right-1/4 w-6 h-6 bg-pink-400/40 rounded-full"
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-blue-400/50 rounded-full"
                    animate={{
                      x: [0, 25, 0],
                      opacity: [0.5, 0.9, 0.5],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className="absolute top-1/2 left-1/4 w-3 h-3 bg-yellow-400/40 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                {/* Art title and description */}
                <div className="p-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold mb-4 text-black dark:text-white"
                  >
                    {featuredArt[selectedArt]?.title || "Artwork"}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-600 dark:text-slate-300 leading-relaxed"
                  >
                    {featuredArt[selectedArt]?.description || "A stunning digital art piece that explores the intersection of technology and creativity. This work represents the endless possibilities of digital expression and the beauty that emerges from the fusion of artistic vision and technical skill."}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-4 mt-6 text-sm text-slate-500 dark:text-slate-400"
                  >
                    <span>{featuredArt[selectedArt]?.category || "Digital Art"}</span>
                    <span>•</span>
                    <span>{featuredArt[selectedArt]?.year || "2025"}</span>
                    <span>•</span>
                    <span>{featuredArt[selectedArt]?.medium || "Mixed Media"}</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// Process Section
function ProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Research & Planning",
      description:
        "Understanding requirements, user needs, and technical constraints to create a solid foundation.",
    },
    {
      number: "02",
      title: "Design & Prototype",
      description:
        "Creating wireframes, mockups, and interactive prototypes to visualize the solution.",
    },
    {
      number: "03",
      title: "Development",
      description:
        "Writing clean, efficient code using modern technologies and best practices.",
    },
    {
      number: "04",
      title: "Testing & Launch",
      description:
        "Rigorous testing, optimization, and deployment to ensure a flawless user experience.",
    },
  ];

  return (
    <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 text-center">
          Process
        </AnimatedText>
        <AnimatedText
          delay={0.2}
          className="text-4xl md:text-5xl font-bold mb-16 text-center text-black dark:text-white"
        >
          How I bring ideas to life
        </AnimatedText>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.div
                className="text-6xl font-bold text-slate-200 dark:text-slate-700 mb-6"
                whileInView={{
                  color: ["#e2e8f0", "#64748b", "#e2e8f0"],
                }}
                transition={{ duration: 2, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {step.number}
              </motion.div>
              <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Salah Eddine delivered an exceptional web application that exceeded our expectations. His attention to detail and technical expertise are outstanding.",
      author: "Maria Rodriguez",
      role: "Product Manager, TechStart",
    },
    {
      quote:
        "Working with Salah on our game project was incredible. His creativity and problem-solving skills brought our vision to life perfectly.",
      author: "James Chen",
      role: "Creative Director, GameStudio",
    },
    {
      quote:
        "The digital art pieces Salah created for our brand campaign were absolutely stunning. True artistic vision combined with technical mastery.",
      author: "Sophie Laurent",
      role: "Art Director, CreativeAgency",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
          Testimonials
        </AnimatedText>
        <AnimatedText
          delay={0.2}
          className="text-4xl md:text-5xl font-bold mb-16 text-black dark:text-white"
        >
          What clients say
        </AnimatedText>

        <div className="relative h-64 flex items-center justify-center">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: index === currentIndex ? 1 : 0,
                y: index === currentIndex ? 0 : 20,
              }}
              transition={{ duration: 0.8, ease: [0.21, 1, 0.81, 1] }}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-8 text-slate-700 dark:text-slate-300">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-semibold text-lg text-black dark:text-white">
                  {testimonial.author}
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  {testimonial.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-black dark:bg-white w-8"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  return (
    <section id="contact" className="py-32 px-6 text-black dark:text-white">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
          Contact
        </AnimatedText>
        <AnimatedText
          delay={0.2}
          className="text-4xl md:text-6xl font-bold mb-8 text-black dark:text-white"
        >
          Let's create something amazing
        </AnimatedText>
        <AnimatedText
          delay={0.4}
          className="text-xl text-slate-600 dark:text-slate-300 mb-16 max-w-2xl mx-auto"
        >
          Ready to bring your next project to life? Whether it's web
          development, game development, or digital art, let's collaborate.
        </AnimatedText>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto space-y-6"
        >
          <Input
            placeholder="Your Name"
            className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
          <Input
            placeholder="Your Email"
            className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
          <Textarea
            placeholder="Tell me about your project"
            className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 min-h-32"
          />
          <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 py-6 text-lg font-medium group">
            Send Message
            <motion.div
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="flex justify-center space-x-8 text-slate-600 dark:text-slate-400">
            <motion.a
              href="mailto:dev@boussettahsalah.online"
              className="flex items-center space-x-2 hover:text-black dark:hover:text-white transition-colors duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>dev@boussettahsalah.online</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function SalahEddinePortfolio() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is the first visit in this session
    const hasSeenLoading = sessionStorage.getItem("hasSeenLoading");

    if (hasSeenLoading) {
      // If user has already seen loading, skip it
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    // Mark that user has seen the loading screen
    sessionStorage.setItem("hasSeenLoading", "true");
    setIsLoading(false);
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AmbientBackground />
          <Navigation />
          <ThemeToggle />

          <HeroSection />
          <AboutSection />
          <WorkSection />
          <ProcessSection />
          <TestimonialsSection />
          <ContactSection />
        </motion.div>
      )}
    </div>
  );
}
