/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tmuyjqxhddjkhgxywvqz.supabase.co',
      },
    ],
  },
};

export default nextConfig;
