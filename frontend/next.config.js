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
      'ae01.alicdn.com',
      'ae02.alicdn.com',
      'ae03.alicdn.com',
      'ae04.alicdn.com',
      'storage.googleapis.com',
      'images.unsplash.com',
      'cdn.shopify.com',
      'placehold.co',
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
