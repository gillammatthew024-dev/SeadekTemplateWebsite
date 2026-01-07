/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // images config if needed for Image component
  images: {
    remotePatterns: [
      { 
        protocol: 'https',
        hostname: 'images.unsplash.com' 
      },
    ],
  },
};

export default nextConfig;