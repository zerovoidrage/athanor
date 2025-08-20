import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Отключаем Next.js dev overlay (иконку в углу экрана)
  devIndicators: {
    buildActivity: false,
  },
  
  async rewrites() {
    return [
      // Founder routes
      {
        source: '/launchpad',
        destination: '/founder/launchpad',
      },
      {
        source: '/wallet',
        destination: '/founder/wallet',
      },
      {
        source: '/referral',
        destination: '/founder/referral',
      },
      // Investor routes
      {
        source: '/vault',
        destination: '/investor/dashboard',
      },
      // Advisor routes
      {
        source: '/services',
        destination: '/advisor/services',
      },

    ];
  },
};

export default nextConfig;
