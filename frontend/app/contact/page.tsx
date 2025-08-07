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
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
  Sun,
  Moon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      transition={{ delay: 0.2, duration: 0.8 }}
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
              className="text-2xl font-bold tracking-tight"
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
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className={`text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors duration-300 font-medium relative group cursor-pointer ${
                    item.name === "Contact" ? "text-black dark:text-white" : ""
                  }`}
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
                  delay: 0.4 + navItems.length * 0.1,
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
                    className={`block py-3 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors duration-300 font-medium cursor-pointer ${
                      item.name === "Contact"
                        ? "text-black dark:text-white"
                        : ""
                    }`}
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

// Floating background elements
function FloatingElements() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-slate-400/30 dark:bg-slate-600/30 rounded-full"
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-3/4 right-1/4 w-1 h-1 bg-slate-500/40 dark:bg-slate-500/40 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-3 h-3 bg-slate-300/20 dark:bg-slate-700/20 rounded-full"
        animate={{
          x: [0, 20, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-slate-400/25 dark:bg-slate-600/25 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </div>
  );
}

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitStatus("success");

    // Reset form after success
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitStatus("idle");
    }, 3000);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your Name"
            required
            className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-white transition-colors duration-300"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Your Email"
            required
            className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-white transition-colors duration-300"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <Input
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="Subject"
          required
          className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-white transition-colors duration-300"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tell me about your project..."
          required
          rows={6}
          className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-white transition-colors duration-300 resize-none"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        <Button
          type="submit"
          disabled={isSubmitting || submitStatus === "success"}
          className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 py-6 text-lg font-medium group relative overflow-hidden disabled:opacity-50"
        >
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div
                key="submitting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full mr-2"
                />
                Sending...
              </motion.div>
            ) : submitStatus === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Message Sent!
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center"
              >
                Send Message
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Send className="w-5 h-5" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-black/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </Button>
      </motion.div>
    </motion.form>
  );
}

// Contact Info Component
function ContactInfo() {
  const contactDetails = [
    {
      icon: Mail,
      label: "Email",
      value: "dev@boussettahsalah.online",
      href: "mailto:dev@boussettahsalah.online",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "San Francisco, CA",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com",
      color: "hover:text-black dark:hover:text-white",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com",
      color: "hover:text-blue-600",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com",
      color: "hover:text-blue-400",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
          Get in Touch
        </h3>

        {contactDetails.map((detail, index) => (
          <motion.a
            key={detail.label}
            href={detail.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            whileHover={{ x: 5 }}
            className="flex items-center space-x-4 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors duration-300 group"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300"
            >
              <detail.icon className="w-5 h-5 group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
            </motion.div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {detail.label}
              </div>
              <div className="font-medium">{detail.value}</div>
            </div>
          </motion.a>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="pt-8 border-t border-slate-200 dark:border-slate-700"
      >
        <h4 className="text-lg font-semibold text-black dark:text-white mb-4">
          Follow Me
        </h4>
        <div className="flex space-x-4">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 ${social.color} transition-all duration-300 hover:shadow-lg`}
            >
              <social.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="pt-8 border-t border-slate-200 dark:border-slate-700"
      >
        <h4 className="text-lg font-semibold text-black dark:text-white mb-4">
          Availability
        </h4>
        <div className="space-y-2 text-slate-600 dark:text-slate-300">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
            <span>Available for new projects</span>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Response time: Usually within 24 hours
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ContactPage() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <FloatingElements />
      <Navigation />
      <ThemeToggle />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pt-32 pb-20 px-6 relative overflow-hidden"
      >
        <motion.div style={{ y }} className="max-w-4xl mx-auto text-center">
          <AnimatedText className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
            Contact
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
              Let's Create
            </motion.span>
            <br />
            <span className="text-black dark:text-white">
              Something Amazing
            </span>
          </AnimatedText>

          <AnimatedText
            delay={0.4}
            className="text-xl text-slate-600 dark:text-slate-300 mb-2 max-w-2xl mx-auto leading-relaxed"
          >
            Ready to bring your vision to life? Whether it's web development,
            game development, or digital art, I'm here to help you create
            something extraordinary.
          </AnimatedText>
        </motion.div>
      </motion.section>

      {/* Contact Form and Info Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50"
            >
              <h2 className="text-3xl font-bold text-black dark:text-white mb-8">
                Send a Message
              </h2>
              <ContactForm />
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:pl-8"
            >
              <ContactInfo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedText className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white">
            Ready to Start Your Project?
          </AnimatedText>
          <AnimatedText
            delay={0.2}
            className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
          >
            Let's discuss your ideas and turn them into reality. I'm always
            excited to work on new challenges and creative projects.
          </AnimatedText>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button className="group bg-black dark:bg-white text-white dark:text-black px-8 py-6 text-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300">
              <Mail className="w-5 h-5 mr-2" />
              Email Me
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>

            <Button
              variant="outline"
              className="group border-2 border-black dark:border-white text-black dark:text-white px-8 py-6 text-lg font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
            >
              View Portfolio
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
