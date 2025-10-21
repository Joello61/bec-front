/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  allowedDevOrigins: [
    'http://192.168.1.162:3000', // ton frontend sur réseau local
    'http://localhost:3000'      // ton frontend sur ton PC
  ],

  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src', 'types'],
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cobage-api.joeltech.dev',
        port: '',
        pathname: '/uploads/**',
      }
    ],
  },
  
  typedRoutes: true
};

export default nextConfig;