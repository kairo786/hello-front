/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,   // disables lightningcss optimization
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      /Critical dependency: require function/
    ];
    return config;
  },
};

export default nextConfig;
