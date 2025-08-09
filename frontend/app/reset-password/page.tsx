"use client";

import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Sun,
  Moon,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Mail,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ClientOnly from "@/components/ClientOnly";

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
    if (isAnimating) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const newTheme = theme === "dark" ? "light" : "dark";
    setNextTheme(newTheme);
    setAnimationOrigin({ x: centerX, y: centerY });
    setIsAnimating(true);

    setTimeout(() => {
      setTheme(newTheme);
    }, 400);

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

// Reset Password Form Component
function ResetPasswordForm() {
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState("dev@boussettahsalah.online");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  // Countdown timer for resend code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { authAPI } = await import('@/lib/api');
      await authAPI.requestResetCode(email);
      
      setStep('code');
      setCountdown(60); // 60 seconds cooldown
    } catch (error: any) {
      setError(error.message || "Failed to send reset code");
    }

    setIsLoading(false);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (resetCode.length !== 6) {
      setError("Please enter the 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      const { authAPI } = await import('@/lib/api');
      await authAPI.verifyResetCode(email, resetCode);
      
      setStep('password');
    } catch (error: any) {
      setError(error.message || "Invalid reset code");
    }

    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const { authAPI } = await import('@/lib/api');
      await authAPI.resetPassword(email, resetCode, newPassword, confirmPassword);
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Password reset failed");
    }

    setIsLoading(false);
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError("");

    try {
      const { authAPI } = await import('@/lib/api');
      await authAPI.requestResetCode(email);
      
      setCountdown(60);
    } catch (error: any) {
      setError(error.message || "Failed to resend code");
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </motion.div>
        <h3 className="text-xl font-bold text-black dark:text-white mb-2">
          Password Reset Successfully!
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Your password has been updated. Redirecting to login...
        </p>
        <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-black dark:border-t-white rounded-full animate-spin mx-auto"></div>
      </motion.div>
    );
  }

  // Step 1: Email Input
  if (step === 'email') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="w-full max-w-md mx-auto"
      >
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@boussettahsalah.online"
                required
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-white transition-colors duration-300 pl-12"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              We'll send a 6-digit verification code to this email address.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 py-6 text-lg font-medium group relative overflow-hidden disabled:opacity-50"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
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
                  Sending Code...
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Reset Code
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center space-y-2"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Remember your password?
          </p>
          <Link
            href="/login"
            className="text-sm text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors inline-block"
          >
            ← Back to Login
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // Step 2: Code Verification
  if (step === 'code') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
            Check Your Email
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleCodeSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Verification Code
            </label>
            <Input
              type="text"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              required
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-white transition-colors duration-300 text-center text-2xl font-mono tracking-widest"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <Button
            type="submit"
            disabled={isLoading || resetCode.length !== 6}
            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 py-6 text-lg font-medium group relative overflow-hidden disabled:opacity-50"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
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
                  Verifying Code...
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Verify Code
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResendCode}
            disabled={countdown > 0 || isLoading}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center space-y-2"
        >
          <button
            onClick={() => setStep('email')}
            className="text-sm text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors inline-block"
          >
            ← Change Email Address
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // Step 3: New Password
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
          Code Verified!
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Now set your new password
        </p>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-white transition-colors duration-300 pl-12 pr-12"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-black dark:focus:border-white transition-colors duration-300 pl-12 pr-12"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !newPassword || !confirmPassword}
          className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 py-6 text-lg font-medium group relative overflow-hidden disabled:opacity-50"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
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
                Resetting Password...
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center"
              >
                <Shield className="w-5 h-5 mr-2" />
                Reset Password
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      >
        <motion.div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6"
          >
            Password Recovery
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
          >
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-r from-black via-slate-600 to-black dark:from-white dark:via-slate-400 dark:to-white bg-[length:200%_100%] bg-clip-text text-transparent"
            >
              Reset
            </motion.span>
            <br />
            <span className="text-black dark:text-white">Password</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Reset your admin password using your registered email address.
          </motion.p>

          <ResetPasswordForm />
        </motion.div>
      </motion.section>
    </div>
  );
}