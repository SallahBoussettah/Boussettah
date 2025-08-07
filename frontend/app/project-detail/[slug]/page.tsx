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
  ArrowLeft,
  ExternalLink,
  Github,
  Sun,
  Moon,
  Code,
  Gamepad2,
  Smartphone,
  Globe,
  Calendar,
  Star,
  Download,
  Play,
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useParams } from "next/navigation";

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
    { name: "Art", href: "/#art" },
    { name: "Contact", href: "/#contact" },
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

// Project data
const projectsData = {
  "ecommerce-platform": {
    title: "E-Commerce Platform",
    subtitle: "Full-Stack Shopping Solution",
    description:
      "A comprehensive e-commerce platform built with modern technologies, featuring advanced user authentication, secure payment processing, real-time inventory management, and a powerful admin dashboard. The platform supports multiple payment methods, automated email notifications, and responsive design for optimal user experience across all devices.",
    longDescription:
      "This e-commerce platform represents a complete solution for online retail businesses. Built with React and Node.js, it features a microservices architecture that ensures scalability and maintainability. The platform includes advanced features such as real-time inventory tracking, automated order processing, customer analytics, and a comprehensive admin panel for managing products, orders, and customers.",
    technologies: [
      "React",
      "Node.js",
      "MongoDB",
      "Stripe",
      "JWT",
      "Redux",
      "Express",
      "Socket.io",
    ],
    category: "web",
    year: "2025",
    status: "completed",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
    stars: "45",
    featured: true,
    images: [
      "/placeholder.svg?height=600&width=800&text=Homepage",
      "/placeholder.svg?height=600&width=800&text=Product+Page",
      "/placeholder.svg?height=600&width=800&text=Shopping+Cart",
      "/placeholder.svg?height=600&width=800&text=Admin+Dashboard",
    ],
    features: [
      "User Authentication & Authorization",
      "Product Catalog Management",
      "Shopping Cart & Checkout",
      "Payment Processing (Stripe)",
      "Order Management System",
      "Admin Dashboard",
      "Real-time Inventory Tracking",
      "Email Notifications",
      "Responsive Design",
      "Search & Filtering",
    ],
    challenges: [
      "Implementing secure payment processing",
      "Real-time inventory synchronization",
      "Optimizing database queries for large product catalogs",
      "Creating a scalable architecture",
    ],
    learnings: [
      "Advanced React patterns and state management",
      "Microservices architecture design",
      "Payment gateway integration",
      "Database optimization techniques",
    ],
  },
  "pixel-adventure": {
    title: "Pixel Adventure",
    subtitle: "2D Platformer Game",
    description:
      "An engaging 2D platformer game featuring retro-style pixel art graphics, smooth character controls, multiple challenging levels, and various power-ups. Built with Unity and C#, the game includes enemy AI, physics-based gameplay, and an immersive soundtrack.",
    longDescription:
      "Pixel Adventure is a love letter to classic 2D platformers, combining nostalgic pixel art aesthetics with modern game design principles. The game features tight controls, challenging but fair level design, and a progression system that keeps players engaged. Each level introduces new mechanics and challenges, culminating in epic boss battles.",
    technologies: [
      "Unity",
      "C#",
      "2D Physics",
      "Animation",
      "Audio",
      "Tilemap",
    ],
    category: "game",
    year: "2025",
    status: "completed",
    downloads: "5K+",
    featured: true,
    images: [
      "/placeholder.svg?height=600&width=800&text=Game+Menu",
      "/placeholder.svg?height=600&width=800&text=Level+1",
      "/placeholder.svg?height=600&width=800&text=Boss+Battle",
      "/placeholder.svg?height=600&width=800&text=Power+Ups",
    ],
    features: [
      "20+ Challenging Levels",
      "Smooth Character Controls",
      "Enemy AI System",
      "Power-up System",
      "Boss Battles",
      "Pixel Art Graphics",
      "Dynamic Soundtrack",
      "Achievement System",
      "Save/Load System",
      "Multiple Difficulty Modes",
    ],
    challenges: [
      "Creating responsive character controls",
      "Implementing efficient enemy AI",
      "Optimizing performance for mobile devices",
      "Balancing game difficulty",
    ],
    learnings: [
      "Unity 2D development best practices",
      "Game physics and collision detection",
      "Audio implementation and mixing",
      "Player experience and game feel",
    ],
  },
  "fitness-tracker": {
    title: "Fitness Tracker",
    subtitle: "Health & Wellness App",
    description:
      "A comprehensive fitness tracking mobile application built with React Native. Features include workout planning, nutrition tracking, progress analytics, social features, and integration with health APIs for a complete wellness experience.",
    longDescription:
      "The Fitness Tracker app is designed to be your complete wellness companion. It combines workout tracking, nutrition monitoring, and social features to create a comprehensive health platform. The app uses machine learning to provide personalized recommendations and integrates with various health APIs to give users a complete picture of their fitness journey.",
    technologies: [
      "React Native",
      "Expo",
      "Firebase",
      "Charts",
      "HealthKit",
      "AsyncStorage",
    ],
    category: "mobile",
    year: "2025",
    status: "completed",
    downloads: "2K+",
    images: [
      "/placeholder.svg?height=800&width=400&text=Dashboard",
      "/placeholder.svg?height=800&width=400&text=Workout+Tracker",
      "/placeholder.svg?height=800&width=400&text=Nutrition+Log",
      "/placeholder.svg?height=800&width=400&text=Progress+Charts",
    ],
    features: [
      "Workout Planning & Tracking",
      "Nutrition Logging",
      "Progress Analytics",
      "Social Features",
      "Health API Integration",
      "Custom Exercise Library",
      "Goal Setting & Tracking",
      "Offline Mode Support",
      "Push Notifications",
      "Data Export",
    ],
    challenges: [
      "Integrating with multiple health APIs",
      "Creating smooth animations on mobile",
      "Implementing offline data synchronization",
      "Optimizing battery usage",
    ],
    learnings: [
      "React Native development patterns",
      "Mobile app performance optimization",
      "Health data privacy considerations",
      "Cross-platform development challenges",
    ],
  },
};

// Project Detail Page Component
export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = projectsData[slug as keyof typeof projectsData];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link href="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getIcon = (category: string) => {
    switch (category) {
      case "web":
        return <Globe className="w-8 h-8" />;
      case "game":
        return <Gamepad2 className="w-8 h-8" />;
      case "mobile":
        return <Smartphone className="w-8 h-8" />;
      default:
        return <Code className="w-8 h-8" />;
    }
  };

  const getColor = (category: string) => {
    switch (category) {
      case "web":
        return "text-blue-500";
      case "game":
        return "text-green-500";
      case "mobile":
        return "text-purple-500";
      default:
        return "text-slate-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white overflow-x-hidden">
      <AmbientBackground />
      <Navigation />
      <ThemeToggle />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ x: -5 }}
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Projects</span>
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Project Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center space-x-4 mb-6"
              >
                <div className={`${getColor(project.category)}`}>
                  {getIcon(project.category)}
                </div>
                <div>
                  <span className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {project.category === "web"
                      ? "Web Development"
                      : project.category === "game"
                      ? "Game Development"
                      : "Mobile Application"}
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white"
              >
                {project.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-slate-600 dark:text-slate-300 mb-6"
              >
                {project.subtitle}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8"
              >
                {project.longDescription}
              </motion.p>

              {/* Project Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap gap-6 mb-8"
              >
                <div className="flex items-center space-x-2">
                  {getStatusIcon(project.status)}
                  <span className="text-sm font-medium capitalize">
                    {project.status.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <span className="text-sm font-medium">{project.year}</span>
                </div>
                {project.stars && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-slate-500" />
                    <span className="text-sm font-medium">
                      {project.stars} stars
                    </span>
                  </div>
                )}
                {project.downloads && (
                  <div className="flex items-center space-x-2">
                    <Download className="w-5 h-5 text-slate-500" />
                    <span className="text-sm font-medium">
                      {project.downloads} downloads
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Live Preview
                    </Button>
                  </motion.a>
                )}
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" className="border-2">
                      <Github className="w-5 h-5 mr-2" />
                      View Code
                    </Button>
                  </motion.a>
                )}
                {project.category === "game" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" className="border-2">
                      <Play className="w-5 h-5 mr-2" />
                      Play Game
                    </Button>
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* Project Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div
                className={`aspect-video rounded-2xl overflow-hidden shadow-2xl ${
                  project.category === "mobile"
                    ? "aspect-[9/16] max-w-sm mx-auto"
                    : ""
                }`}
              >
                <img
                  src={project.images[0] || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <AnimatedText className="text-2xl font-bold mb-8 text-center">
            Technologies Used
          </AnimatedText>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {project.technologies.map((tech, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-2 bg-white dark:bg-black rounded-full text-slate-700 dark:text-slate-300 font-medium shadow-md border border-slate-200 dark:border-slate-700"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedText className="text-2xl font-bold mb-12 text-center">
            Key Features
          </AnimatedText>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges & Learnings Section */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Challenges */}
            <div>
              <AnimatedText className="text-2xl font-bold mb-8">
                Challenges Overcome
              </AnimatedText>
              <div className="space-y-4">
                {project.challenges.map((challenge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3 p-4 bg-white dark:bg-black rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {challenge}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Learnings */}
            <div>
              <AnimatedText className="text-2xl font-bold mb-8">
                Key Learnings
              </AnimatedText>
              <div className="space-y-4">
                {project.learnings.map((learning, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3 p-4 bg-white dark:bg-black rounded-lg"
                  >
                    <Star className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {learning}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Projects CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedText className="text-3xl font-bold mb-6">
            Explore More Projects
          </AnimatedText>
          <AnimatedText
            delay={0.2}
            className="text-xl text-slate-600 dark:text-slate-300 mb-8"
          >
            Check out my other work and see what else I've been building.
          </AnimatedText>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/projects">
              <Button className="bg-black dark:bg-white text-white dark:text-black px-8 py-6 text-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200">
                View All Projects
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
