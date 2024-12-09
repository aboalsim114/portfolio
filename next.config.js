const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media.dev.to',
        pathname: '**',
      },
    ],
    domains: [
      'media2.dev.to',
      'dev-to-uploads.s3.amazonaws.com'
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: '/404',
        destination: '/',
        permanent: true,
      },
      {
        source: '/500',
        destination: '/',
        permanent: true,
      },
    ]
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },
}

module.exports = nextConfig