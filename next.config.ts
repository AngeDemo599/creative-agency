import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://10.244.133.51:3636", "http://localhost:3636"],
};

export default nextConfig;
