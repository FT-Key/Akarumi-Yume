/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Unsplash (tests / placeholders)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },

      // Firebase Storage (imágenes de productos)
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
