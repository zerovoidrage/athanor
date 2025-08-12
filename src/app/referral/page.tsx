'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ReferralPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 relative w-full">
        <div className="relative z-10 pt-20" style={{ marginTop: '30vh' }}>
          <div className="w-full p-5">
            {/* Заголовок */}
            <div className="mb-12">
              <motion.h1 
                className="text-display font-regular text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Referral Program
              </motion.h1>
              <motion.p 
                className="text-subheading text-white-800 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Invite friends and earn rewards
              </motion.p>
            </div>

            {/* Контент реферальной программы */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="bg-onsurface-900 rounded-lg p-6">
                <h2 className="text-heading text-white mb-4">Your Referral Link</h2>
                <div className="bg-onsurface-800 rounded p-3 text-subheading text-white-800 font-mono">
                  https://athanor.com/ref/user123
                </div>
              </div>

              <div className="bg-onsurface-900 rounded-lg p-6">
                <h2 className="text-heading text-white mb-4">Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-subheading text-white-800">Total Referrals</div>
                    <div className="text-display text-white">0</div>
                  </div>
                  <div>
                    <div className="text-subheading text-white-800">Earnings</div>
                    <div className="text-display text-white">$0.00</div>
                  </div>
                </div>
              </div>

              <div className="bg-onsurface-900 rounded-lg p-6">
                <h2 className="text-heading text-white mb-4">How It Works</h2>
                <div className="space-y-3 text-subheading text-white-800">
                  <div>1. Share your referral link with friends</div>
                  <div>2. When they sign up, you both get rewards</div>
                  <div>3. Earn 10% commission on their first purchase</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Coming soon блок внизу */}
      <div className="p-4 pb-10">
        <h1 className="text-heading text-white-900 mb-6">Referral Program</h1>
        <div className="bg-onsurface-900 rounded-lg p-6">
          <p className="text-body text-white-700">Referral program functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
}
