'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function WalletPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 relative w-full">
        <div className="relative z-10 pt-20" style={{ marginTop: '30vh' }}>
          <div className="w-full p-5">


            {/* Контент кошелька */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="bg-onsurface-900 rounded-lg p-6">
                <h2 className="text-heading text-white mb-4">Balance</h2>
                <div className="text-display text-white">$0.00</div>
              </div>

              <div className="bg-onsurface-900 rounded-lg p-6">
                <h2 className="text-heading text-white mb-4">Recent Transactions</h2>
                <div className="text-subheading text-white-800">No transactions yet</div>
              </div>

              <div className="bg-onsurface-900 rounded-lg p-6">
                <h2 className="text-heading text-white mb-4">Connected Wallets</h2>
                <div className="text-subheading text-white-800">No wallets connected</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Coming soon блок внизу */}
      <div className="p-4 pb-10">
        <h1 className="text-heading text-white-900 mb-6">Wallet</h1>
        <div className="bg-onsurface-900 rounded-lg p-6">
          <p className="text-body text-white-700">Wallet functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
}
