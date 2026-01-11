import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_URL: "http://localhost:3000",
    NEXTAUTH_URL: "http://localhost:3000",
    NEXTAUTH_SECRET: "justrandomsecret12345",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c.tenor.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "english.onlinekhabar.com",
      },
      {
        protocol: "http",
        hostname: "english.onlinekhabar.com",
      },
      {
        protocol: "https",
        hostname: "myrepublica.nagariknetwork.com",
      },
      {
        protocol: "http",
        hostname: "myrepublica.nagariknetwork.com",
      },
      {
        protocol: "https",
        hostname: "nepalonlinepatrika.com",
      },
      {
        protocol: "http",
        hostname: "nepalonlinepatrika.com",
      },
      {
        protocol: "https",
        hostname: "telegraphnepal.com",
      },
      {
        protocol: "http",
        hostname: "telegraphnepal.com",
      },
      {
        protocol: "https",
        hostname: "onlinetvnepal.com",
      },
      {
        protocol: "http",
        hostname: "onlinetvnepal.com",
      },
      {
        protocol: "https",
        hostname: "eadarsha.com",
      },
      {
        protocol: "http",
        hostname: "eadarsha.com",
      },
      {
        protocol: "https",
        hostname: "arthasarokar.com",
      },
      {
        protocol: "http",
        hostname: "arthasarokar.com",
      },
      {
        protocol: "https",
        hostname: "ratopati.com",
      },
      {
        protocol: "http",
        hostname: "ratopati.com",
      },
      {
        protocol: "https",
        hostname: "techmandu.com",
      },
      {
        protocol: "http",
        hostname: "techmandu.com",
      },
      {
        protocol: "https",
        hostname: "osnepal.com",
      },
      {
        protocol: "http",
        hostname: "osnepal.com",
      },
      {
        protocol: "https",
        hostname: "newsofnepal.com",
      },
      {
        protocol: "http",
        hostname: "newsofnepal.com",
      },
      {
        protocol: "https",
        hostname: "rajdhanidaily.com",
      },
      {
        protocol: "http",
        hostname: "rajdhanidaily.com",
      },
      {
        protocol: "https",
        hostname: "election.gov.np",
      },
      {
        protocol: "http",
        hostname: "election.gov.np",
      },
    ],
  },
};
export default nextConfig;
