/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'cbu01.alicdn.com',
      'img.alicdn.com',
      'cjdropshipping.com',
      'files.cjdropshipping.com',
    ],
    unoptimized: true, // Required for Firebase Hosting static serving
  },
  // Trailing slash for Firebase Hosting compatibility
  trailingSlash: true,
  // Environment variables exposed to client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },
}

module.exports = nextConfig
