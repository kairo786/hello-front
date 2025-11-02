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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        // यदि आवश्यक हो तो पोर्ट और पाथनेम भी जोड़ा जा सकता है
      },
    ],
  },
  
};

export default nextConfig;
