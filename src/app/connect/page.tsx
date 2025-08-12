'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ConnectPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleRoleSelect = (role: 'founder' | 'investor' | 'advisor') => {
    login(role);
    
    // Перенаправляем в зависимости от роли
    switch (role) {
      case 'founder':
        router.push('/launchpad');
        break;
      case 'investor':
        router.push('/investor/dashboard');
        break;
      case 'advisor':
        router.push('/advisor/services');
        break;
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative z-10 pt-20" style={{ marginTop: '30vh' }}>
        <div className="w-full p-5 pb-20">
          {/* Заголовок */}
          <div className="mb-12">
            <motion.h1 
              className="text-display font-regular text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Choose Your Role
            </motion.h1>
            <motion.p 
              className="text-subheading text-white-800 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Select your role to access the appropriate dashboard
            </motion.p>
          </div>

          {/* Выбор роли */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="space-y-6 max-w-md"
          >
            <motion.div
              className="bg-onsurface-900 rounded-lg p-6 cursor-pointer hover:bg-onsurface-800 transition-colors"
              onClick={() => handleRoleSelect('founder')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h2 className="text-heading text-white mb-2">Founder</h2>
              <p className="text-subheading text-white-800">
                Build and launch your startup with our tools and services
              </p>
            </motion.div>

            <motion.div
              className="bg-onsurface-900 rounded-lg p-6 cursor-pointer hover:bg-onsurface-800 transition-colors"
              onClick={() => handleRoleSelect('investor')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h2 className="text-heading text-white mb-2">Investor</h2>
              <p className="text-subheading text-white-800">
                Discover and invest in promising startups
              </p>
            </motion.div>

            <motion.div
              className="bg-onsurface-900 rounded-lg p-6 cursor-pointer hover:bg-onsurface-800 transition-colors"
              onClick={() => handleRoleSelect('advisor')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h2 className="text-heading text-white mb-2">Advisor</h2>
              <p className="text-subheading text-white-800">
                Provide expert services and guidance to startups
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
