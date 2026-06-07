import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phones/other LAN devices to load the dev server over the network IP.
  // Without this, Next 16 blocks cross-origin dev requests (RSC/HMR/server
  // actions), so the page renders but never hydrates — tabs/buttons appear but
  // don't respond to taps. Use your machine's LAN IP shown in `next dev`.
  allowedDevOrigins: ["192.168.1.165"],
};

export default nextConfig;
