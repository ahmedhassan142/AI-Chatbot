/** @type {import('next').NextConfig} */
const nextConfig = {
  // DISABLE TURBOPACK - Force Webpack
   typescript: {
   
    ignoreBuildErrors: true,
  },

  
  // Use Webpack instead
 
  // Other Next.js config
  
};

module.exports = nextConfig;
 