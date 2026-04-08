/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Strict Mode to prevent double-invocation of useEffect in dev
  // which compounds any state update loops
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
