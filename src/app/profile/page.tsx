'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 relative w-full">
        <div className="relative z-10 pt-20" style={{ marginTop: '30vh' }}>
          <div className="w-full p-5">


            {/* Контент профиля */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="bg-onsurface-900 rounded-lg p-6">
                <h2 className="text-heading text-white mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-subheading text-white-800 mb-1">Name</div>
                    <div className="text-display text-white">John Doe</div>
                  </div>
                  <div>
                    <div className="text-subheading text-white-800 mb-1">Email</div>
                    <div className="text-display text-white">john@example.com</div>
                  </div>
                  <div>
                    <div className="text-subheading text-white-800 mb-1">Member Since</div>
                    <div className="text-display text-white">January 2024</div>
                  </div>
                </div>
              </div>

              <div className="bg-onsurface-900 rounded-lg p-6">
                <h2 className="text-heading text-white mb-4">Account Settings</h2>
                <div className="space-y-3 text-subheading text-white-800">
                  <div className="cursor-pointer hover:text-white transition-colors">Change Password</div>
                  <div className="cursor-pointer hover:text-white transition-colors">Update Email</div>
                  <div className="cursor-pointer hover:text-white transition-colors">Privacy Settings</div>
                  <div className="cursor-pointer hover:text-white transition-colors">Notification Preferences</div>
                </div>
              </div>

              <div className="bg-onsurface-900 rounded-lg p-6">
                <h2 className="text-heading text-white mb-4">Activity</h2>
                <div className="text-subheading text-white-800">No recent activity</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Coming soon блок внизу */}
      <div className="p-4 pb-10">
        <h1 className="text-heading text-white-900 mb-6">Profile</h1>
        <div className="bg-onsurface-900 rounded-lg p-6">
          <p className="text-body text-white-700">Profile functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
} 