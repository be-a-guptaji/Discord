import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zs8ph8o0rn.ufs.sh", // For Uploadthing
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
