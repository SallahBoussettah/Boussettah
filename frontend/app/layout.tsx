import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import ClientOnly from "@/components/ClientOnly";
import SEOOptimizations from "@/components/SEOOptimizations";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SB. - Salah Eddine Boussettah | Full Stack Developer & Digital Artist",
    template: "%s | SB. - Salah Eddine Boussettah"
  },
  description:
    "Full Stack Developer from Marrakech, Morocco specializing in React, Next.js, Node.js, and game development. Creating innovative web applications, mobile apps, and digital art. Portfolio showcasing 5+ years of development experience.",
  keywords: [
    "Full Stack Developer Morocco",
    "React Developer Marrakech", 
    "Next.js Developer Morocco",
    "Node.js Developer Marrakech",
    "Game Developer Morocco",
    "Digital Artist Marrakech",
    "Web Development Morocco",
    "Mobile App Development Marrakech",
    "JavaScript Developer Morocco",
    "TypeScript Developer",
    "Freelance Developer Morocco",
    "Portfolio Marrakech",
    "Salah Eddine Boussettah",
    "SB Developer",
    "Morocco Web Developer",
    "Marrakech Software Developer"
  ],
  authors: [{ name: "Salah Eddine Boussettah" }],
  creator: "Salah Eddine Boussettah",
  publisher: "Salah Eddine Boussettah",
  generator: "Next.js",
  applicationName: "SB Portfolio",
  referrer: "origin-when-cross-origin",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "_rR1U1PZy2H7wbWxxlM5GMZ1a-l68jcuH4PHaxfdKnA",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://boussettahsalah.online",
    siteName: "SB. - Salah Eddine Boussettah Portfolio",
    title: "SB. - Full Stack Developer & Digital Artist Portfolio",
    description: "Explore my portfolio featuring innovative web applications, games, and digital art. 5+ years of development experience in React, Next.js, Node.js, and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SB. - Salah Eddine Boussettah Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SB. - Full Stack Developer & Digital Artist",
    description: "Full Stack Developer creating innovative web applications, games, and digital art. Portfolio showcasing 5+ years of experience.",
    images: ["/og-image.jpg"],
    creator: "@SalahBoussettah",
  },
  alternates: {
    canonical: "https://boussettahsalah.online",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <SEOOptimizations />
      </head>
      <body className={inter.className}>
        <ClientOnly>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            <SettingsProvider>
              <AuthProvider>{children}</AuthProvider>
            </SettingsProvider>
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
