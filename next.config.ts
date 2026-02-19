/** @type {import('next').NextConfig} */
const nextConfig = {
  // DISABLE TURBOPACK - Force Webpack
   typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  turbopack: false,
  
  // Use Webpack instead
 
  // Other Next.js config
  
};

module.exports = nextConfig;
 