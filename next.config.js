/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
    turbo: false, // ✅ THIS is the real fix
  },
  webpack: (config) => {
    config.ignoreWarnings = [/Critical dependency: require function/];
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
  },
};

export default nextConfig;
