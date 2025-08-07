"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  Zap,
  Eye,
  Coffee,
  Code,
  Gamepad2,
  Palette,
} from "lucide-react";
import Link from "next/link";

const funMessages = [
  "Oops! Wrong password! 🤔",
  "Nice try, but that's not it! 😄",
  "Hmm, that doesn't seem right... 🧐",
  "Close, but no cigar! 🚭",
  "Error 404: Correct password not found! 💻",
  "Access denied! But thanks for trying! 🔒",
  "Nope! Want to try again? 🎯",
  "That's not the magic word! ✨",
];

const encouragingMessages = [
  "Don't worry, everyone makes mistakes!",
  "Keep trying, you might get lucky!",
  "Maybe try 'password123'? (Just kidding!)",
  "The developer is probably having coffee right now ☕",
  "This is actually more secure than it looks!",
  "Fun fact: This page exists just for this moment!",
  "You're now part of an exclusive club of wrong-password-enterers!",
  "At least you found this easter egg! 🥚",
];

export default function OopsPage() {
  // Pick random messages once when component loads
  const [currentMessage] = useState(() => Math.floor(Math.random() * funMessages.length));
  const [currentEncouragement] = useState(() => Math.floor(Math.random() * encouragingMessages.length));
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements - Updated to match website design */}
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

      {/* Confetti Effect - Updated colors */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: 360,
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  ease: "easeOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.21, 1, 0.81, 1] }}
        className="text-center max-w-2xl relative z-10"
      >
        {/* Main Icon - Updated to match website design */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            type: "spring",
            bounce: 0.4,
          }}
          className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 relative border border-slate-200 dark:border-slate-700"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <AlertTriangle className="w-12 h-12 text-slate-600 dark:text-slate-400" />
          </motion.div>

          {/* Floating sparkles - Updated colors */}
          <motion.div
            className="absolute -top-2 -right-2 w-4 h-4 bg-slate-400 dark:bg-slate-600 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-2 -left-2 w-3 h-3 bg-slate-500 dark:bg-slate-500 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white"
          >
            {funMessages[currentMessage]}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-xl text-slate-600 dark:text-slate-300"
          >
            {encouragingMessages[currentEncouragement]}
          </motion.p>
        </motion.div>

        {/* Fun Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
            While you're here, here's what I actually do:
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg"
            >
              <Code className="w-6 h-6 text-blue-500" />
              <div className="text-left">
                <div className="font-medium text-black dark:text-white">
                  Web Dev
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Modern & Fast
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg"
            >
              <Gamepad2 className="w-6 h-6 text-green-500" />
              <div className="text-left">
                <div className="font-medium text-black dark:text-white">
                  Game Dev
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Fun & Interactive
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg"
            >
              <Palette className="w-6 h-6 text-purple-500" />
              <div className="text-left">
                <div className="font-medium text-black dark:text-white">
                  Digital Art
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Creative & Unique
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link href="/login">
            <Button className="group bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 px-6 py-3 text-lg font-medium flex items-center space-x-2 transition-all duration-300">
              <Zap className="w-5 h-5" />
              <span>Try Again</span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </motion.div>
            </Button>
          </Link>

          <Link href="/">
            <Button
              variant="outline"
              className="group border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-6 py-3 text-lg font-medium flex items-center space-x-2 transition-all duration-300"
            >
              <Eye className="w-5 h-5" />
              <span>View Portfolio</span>
            </Button>
          </Link>
        </motion.div>

        {/* Easter Egg Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-12 text-sm text-slate-500 dark:text-slate-400"
        >
          <p>🎉 Congratulations! You found the secret wrong-password page!</p>
          <p className="mt-1">
            This page was made just for moments like this. Enjoy! ✨
          </p>
        </motion.div>

        {/* Floating Elements - Updated to match website design */}
        <motion.div
          className="absolute top-10 right-10 w-6 h-6 bg-slate-400/30 dark:bg-slate-600/30 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-4 h-4 bg-slate-500/40 dark:bg-slate-500/40 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-1/3 left-20 w-3 h-3 bg-slate-400/50 dark:bg-slate-600/50 rounded-full"
          animate={{
            x: [0, 15, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        />
      </motion.div>
    </div>
  );
}
