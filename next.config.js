/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'test-fe.mysellerpintar.com',
      's3.sellerpintar.com',
      'your-s3-bucket.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;
