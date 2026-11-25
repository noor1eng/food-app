/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/images/**",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
