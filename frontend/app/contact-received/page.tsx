import { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Phone, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Received - Thank You",
  description:
    "Thank you for contacting SB. Your message has been received and I will get back to you within 24 hours.",
  robots: {
    index: false, // Don't index this page in search results
    follow: false,
  },
};

export default function ContactReceivedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Message Received!
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Thank you for reaching out! Your message has been successfully
            received. I'll review your project details and get back to you
            within <strong>24 hours</strong>.
          </p>
        </motion.div>

        {/* What Happens Next */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 mb-8"
        >
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
            What happens next?
          </h2>

          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  1
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Project Review
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  I'll carefully review your project requirements and technical
                  specifications.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  2
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Personalized Response
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  You'll receive a detailed response with project timeline and
                  pricing.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  3
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Project Discussion
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We'll schedule a call to discuss your vision and next steps.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-slate-900 dark:bg-slate-700 rounded-2xl p-8 text-white mb-8"
        >
          <h2 className="text-xl font-semibold mb-6">
            Need immediate assistance?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <Phone className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-slate-300">Call/WhatsApp</span>
              <a
                href="tel:+212649224364"
                className="font-semibold hover:text-blue-400 transition-colors"
              >
                +212 649 224 364
              </a>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <Mail className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-slate-300">Email</span>
              <a
                href="mailto:dev@boussettahsalah.online"
                className="font-semibold hover:text-blue-400 transition-colors"
              >
                dev@boussettahsalah.online
              </a>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <MapPin className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-slate-300">Location</span>
              <span className="font-semibold">Marrakech, Morocco</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/projects">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>View My Work</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300"
            >
              Back to Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-sm text-slate-500 dark:text-slate-400 mt-8"
        >
          Response time: Usually within 2-6 hours during business hours (GMT+1)
        </motion.p>
      </div>
    </div>
  );
}
