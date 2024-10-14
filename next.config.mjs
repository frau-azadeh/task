/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/login',
          permanent: false, // اگر می‌خواهید ریدایرکت موقتی باشد false بگذارید
        },
      ];
    },
  };
  
  export default nextConfig;