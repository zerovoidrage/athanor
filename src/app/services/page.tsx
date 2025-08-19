'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 relative w-full">
        <div className="relative z-10 pt-20" style={{ marginTop: '30vh' }}>
          <div className="w-full p-5">


            {/* Контент Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-onsurface-900 rounded-lg p-6">
                  <h2 className="text-heading text-white mb-4">Active Clients</h2>
                  <div className="text-display text-white">0</div>
                </div>

                <div className="bg-onsurface-900 rounded-lg p-6">
                  <h2 className="text-heading text-white mb-4">Total Earnings</h2>
                  <div className="text-display text-white">$0.00</div>
                </div>

                <div className="bg-onsurface-900 rounded-lg p-6">
                  <h2 className="text-heading text-white mb-4">Services Offered</h2>
                  <div className="text-display text-white">0</div>
                </div>
              </div>

              <div className="bg-onsurface-900 rounded-lg p-6">
                <h2 className="text-heading text-white mb-4">Your Services</h2>
                <div className="text-subheading text-white-800">No services configured yet</div>
              </div>

              <div className="bg-onsurface-900 rounded-lg p-6">
                <h2 className="text-heading text-white mb-4">Recent Requests</h2>
                <div className="text-subheading text-white-800">No requests yet</div>
              </div>

              <div className="bg-onsurface-900 rounded-lg p-6">
                <h2 className="text-heading text-white mb-4">Service Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-subheading text-white-800 cursor-pointer hover:text-white transition-colors">
                    Legal & Compliance
                  </div>
                  <div className="text-subheading text-white-800 cursor-pointer hover:text-white transition-colors">
                    Marketing & PR
                  </div>
                  <div className="text-subheading text-white-800 cursor-pointer hover:text-white transition-colors">
                    Technical
                  </div>
                  <div className="text-subheading text-white-800 cursor-pointer hover:text-white transition-colors">
                    Business Strategy
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Coming soon блок внизу */}
      <div className="p-4 pb-10">
        <h1 className="text-heading text-white-900 mb-6">Advisor Services</h1>
        <div className="bg-onsurface-900 rounded-lg p-6">
          <p className="text-body text-white-700">Advisor services functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
}
