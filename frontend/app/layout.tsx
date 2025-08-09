import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import ClientOnly from '@/components/ClientOnly'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SB. - Salah Eddine Boussettah | Developer & Digital Artist',
  description: 'Software Developer, Game Developer, and Digital Artist. Crafting digital experiences across web development, game development, and digital art.',
  generator: 'SalahEddine',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientOnly>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            <SettingsProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </SettingsProvider>
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  )
}
