/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  experimental: {
    optimizeCss: false, // बस ये रहने दो
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
