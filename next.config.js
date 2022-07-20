/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/accounts',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
