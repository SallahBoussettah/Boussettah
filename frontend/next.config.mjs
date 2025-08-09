/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  // Ensure public assets are copied to standalone build
  outputFileTracingIncludes: {
    '/': ['./public/**/*'],
  },
  async rewrites() {
    return process.env.NODE_ENV === 'production' 
      ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:5000/api/:path*',
          },
        ]
      : [
          {
            source: '/api/:path*',
            destination: 'http://localhost:5000/api/:path*',
          },
        ]
  },
}

export default nextConfig
