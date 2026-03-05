/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Strict Mode to prevent React 18 from double-invoking
  // useEffect in development, which was causing duplicate Gemini API calls (429).
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'ia.media-imdb.com',
      },
    ],
  },
};

module.exports = nextConfig;
