import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hy73ftuu9g.ufs.sh", // For Uploadthing
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
