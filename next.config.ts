import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/KibaOfficial/kio-tsbot/master/src/assets/**"
      }
    ]
  }
};

export default nextConfig;
