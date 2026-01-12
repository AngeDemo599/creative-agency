import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.244.133.51", "localhost", "10.244.133.51:3636", "localhost:3636"],
};

export default nextConfig;
