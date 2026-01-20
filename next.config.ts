import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      hostname: "nd0i0g5tko.ufs.sh"

    },
    {
      protocol: 'http',
      hostname: 'commons.wikimedia.org',
      port: '',
    },
    {
      protocol: 'https',
      hostname: '**',
      port: '',
    },
    {
      protocol: 'http',
      hostname: '**',
      port: '',
    },
    ]
  }
};

export default nextConfig;
