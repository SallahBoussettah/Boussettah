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
  Calendar,
  MapPin,
  Award,
  Code,
  Database,
  Palette,
  Gamepad2,
  Globe,
  Server,
  Smartphone,
  Sun,
  Moon,
  Home,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
function AboutHeroSection() {
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
          About
        </AnimatedText>
        
        <AnimatedText delay={0.2} className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-r from-black via-slate-600 to-black dark:from-white dark:via-slate-400 dark:to-white bg-[length:200%_100%] bg-clip-text text-transparent"
          >
            About Me
          </motion.span>
          <br />
          <span className="text-black dark:text-white">My Journey</span>
        </AnimatedText>
        
        <AnimatedText delay={0.4} className="text-xl text-slate-600 dark:text-slate-300 mb-2 max-w-2xl mx-auto leading-relaxed">
          Discover my journey as a multidisciplinary developer and digital
          artist, exploring the intersection of technology, creativity, and
          innovation.
        </AnimatedText>
      </motion.div>
    </motion.section>
  );
}

// About Me Section
function AboutMeSection() {
  return (
    <section className="py-32 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.21, 1, 0.81, 1] }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="w-full h-96 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10"
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
                className="text-8xl font-bold text-slate-400/50 dark:text-slate-600/50"
              >
                SB
              </motion.div>
            </div>

            {/* Floating elements */}
            <motion.div
              className="absolute top-4 right-4 text-blue-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Code className="w-8 h-8" />
            </motion.div>
            <motion.div
              className="absolute bottom-4 left-4 text-purple-500/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Palette className="w-8 h-8" />
            </motion.div>
            <motion.div
              className="absolute top-1/2 left-4 text-green-500/30"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <Gamepad2 className="w-8 h-8" />
            </motion.div>
          </div>
        </motion.div>

        <div>
          <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
            My Story
          </AnimatedText>
          <AnimatedText
            delay={0.2}
            className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-black dark:text-white"
          >
            Passionate about creating digital experiences
          </AnimatedText>
          <AnimatedText
            delay={0.4}
            className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6"
          >
            Hello! I'm Salah Eddine Boussettah, a multidisciplinary developer
            and digital artist based in Morocco. My journey began with a
            fascination for how technology can bring creative visions to life.
          </AnimatedText>
          <AnimatedText
            delay={0.6}
            className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6"
          >
            Over the years, I've developed expertise across web development,
            game development, and digital art. I believe in the power of
            combining technical skills with artistic vision to create meaningful
            and impactful digital experiences.
          </AnimatedText>
          <AnimatedText
            delay={0.8}
            className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8"
          >
            When I'm not coding or creating art, you can find me exploring new
            technologies, playing games, or sketching ideas for my next project.
            I'm always excited to collaborate on innovative projects that push
            the boundaries of what's possible.
          </AnimatedText>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true }}
            className="flex items-center space-x-4"
          >
            <MapPin className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-600 dark:text-slate-300">
              Based in Morocco
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Education Section
function EducationSection() {
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const { educationAPI } = await import('@/lib/api');
        const data = await educationAPI.getAll();
        setEducation(data);
      } catch (error) {
        console.error('Error fetching education:', error);
        // Fallback to empty array if API fails
        setEducation([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  // Icon mapping
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Award,
      Code,
      Palette,
      Calendar,
      MapPin,
      Database,
      Globe,
      Server,
      Smartphone,
      Gamepad2,
    };
    return iconMap[iconName] || Award;
  };

  if (loading) {
    return (
      <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mx-auto mb-6"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto mb-16"></div>
              <div className="space-y-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 text-center">
          Education
        </AnimatedText>
        <AnimatedText
          delay={0.2}
          className="text-4xl md:text-5xl font-bold mb-16 text-center text-black dark:text-white"
        >
          Academic Journey
        </AnimatedText>

        <div className="space-y-12">
          {education.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center"
                    >
                      {(() => {
                        const IconComponent = getIcon(item.icon);
                        return <IconComponent className="w-6 h-6 text-blue-500" />;
                      })()}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-black dark:text-white">
                        {item.degree}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        {item.school}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {item.year}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
                className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Tech Stack Section
function TechStackSection() {
  const techCategories = [
    {
      title: "Frontend",
      icon: Globe,
      color: "blue",
      technologies: [
        "React",
        "Next.js",
        "Vue.js",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
      ],
    },
    {
      title: "Backend",
      icon: Server,
      color: "green",
      technologies: [
        "Node.js",
        "Python",
        "Express",
        "FastAPI",
        "PostgreSQL",
        "MongoDB",
      ],
    },
    {
      title: "Mobile",
      icon: Smartphone,
      color: "purple",
      technologies: [
        "React Native",
        "Flutter",
        "Swift",
        "Kotlin",
        "Expo",
        "Firebase",
      ],
    },
    {
      title: "Game Dev",
      icon: Gamepad2,
      color: "orange",
      technologies: ["Unity", "Unreal Engine", "Godot", "C#", "C++", "Blender"],
    },
    {
      title: "Design",
      icon: Palette,
      color: "pink",
      technologies: [
        "Figma",
        "Adobe Creative Suite",
        "Sketch",
        "Procreate",
        "Cinema 4D",
        "After Effects",
      ],
    },
    {
      title: "Tools",
      icon: Database,
      color: "indigo",
      technologies: ["Git", "Docker", "AWS", "Vercel", "Linux", "VS Code"],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      green: "text-green-500 bg-green-500/10 border-green-500/20",
      purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
      pink: "text-pink-500 bg-pink-500/10 border-pink-500/20",
      indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 text-center">
          Tech Stack
        </AnimatedText>
        <AnimatedText
          delay={0.2}
          className="text-4xl md:text-5xl font-bold mb-16 text-center text-black dark:text-white"
        >
          Technologies I Work With
        </AnimatedText>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 h-full"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border ${getColorClasses(
                      category.color
                    )}`}
                  >
                    <category.icon className="w-6 h-6" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={techIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1 + techIndex * 0.05,
                      }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium cursor-default"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Experience Section
function ExperienceSection() {
  const experiences = [
    {
      title: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      period: "2022 - Present",
      location: "Remote",
      description:
        "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and architecting system solutions.",
      achievements: [
        "Increased application performance by 40%",
        "Led a team of 5 developers",
        "Implemented CI/CD pipelines",
      ],
    },
    {
      title: "Game Developer",
      company: "Indie Game Studio",
      period: "2021 - 2022",
      location: "Morocco",
      description:
        "Developed mobile and PC games using Unity and C#. Collaborated with artists and designers to create engaging gaming experiences.",
      achievements: [
        "Published 3 successful mobile games",
        "Achieved 100K+ downloads",
        "Implemented multiplayer functionality",
      ],
    },
    {
      title: "Frontend Developer",
      company: "Digital Agency",
      period: "2020 - 2021",
      location: "Casablanca, Morocco",
      description:
        "Created responsive web applications and interactive user interfaces. Worked closely with design teams to implement pixel-perfect designs.",
      achievements: [
        "Delivered 15+ client projects",
        "Improved website loading speed by 60%",
        "Implemented modern design systems",
      ],
    },
    {
      title: "Digital Artist (Freelance)",
      company: "Various Clients",
      period: "2019 - Present",
      location: "Remote",
      description:
        "Creating digital illustrations, concept art, and visual designs for games, websites, and marketing materials.",
      achievements: [
        "Completed 50+ art commissions",
        "Worked with international clients",
        "Developed unique art style",
      ],
    },
  ];

  return (
    <section className="py-32 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 text-center">
          Experience
        </AnimatedText>
        <AnimatedText
          delay={0.2}
          className="text-4xl md:text-5xl font-bold mb-16 text-center text-black dark:text-white"
        >
          Professional Journey
        </AnimatedText>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Timeline dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                  className="absolute left-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-black hidden md:block"
                />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="md:ml-20 bg-white dark:bg-black p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-black dark:text-white mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-blue-500 font-medium">{exp.company}</p>
                    </div>
                    <div className="flex flex-col md:items-end mt-2 md:mt-0">
                      <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{exp.period}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  <div>
                    <h4 className="font-semibold text-black dark:text-white mb-2">
                      Key Achievements:
                    </h4>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, achIndex) => (
                        <motion.li
                          key={achIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.2 + achIndex * 0.1 + 0.5,
                          }}
                          viewport={{ once: true }}
                          className="flex items-center space-x-2 text-slate-600 dark:text-slate-300"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <span>{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Call to Action Section
function CTASection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedText className="text-4xl md:text-5xl font-bold mb-8 text-black dark:text-white">
          Let's Work Together
        </AnimatedText>
        <AnimatedText
          delay={0.2}
          className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto"
        >
          Ready to bring your ideas to life? I'm always excited to collaborate
          on innovative projects that push the boundaries of technology and
          creativity.
        </AnimatedText>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link href="/#contact">
            <Button className="group bg-black dark:bg-white text-white dark:text-black px-8 py-6 text-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300">
              Get In Touch
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>
          </Link>

          <Link href="/projects">
            <Button
              variant="outline"
              className="group border-2 border-black dark:border-white text-black dark:text-white px-8 py-6 text-lg font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
            >
              <Code className="w-5 h-5 mr-2" />
              View Projects
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white overflow-x-hidden">
      <AmbientBackground />
      <Navigation />
      <ThemeToggle />

      <AboutHeroSection />
      <AboutMeSection />
      <EducationSection />
      <TechStackSection />
      <ExperienceSection />
      <CTASection />
    </div>
  );
}
