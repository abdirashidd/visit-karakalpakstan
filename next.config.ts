// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 🔥 Build paytida TypeScript xatolarini tekshirmaslik
    ignoreBuildErrors: true,
  },
  eslint: {
    // 🔥 Build paytida ESLint xatolarini tekshirmaslik
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;