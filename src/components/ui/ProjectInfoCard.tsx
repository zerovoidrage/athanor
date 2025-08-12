'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectInfoCardProps {
  isVisible: boolean;
  projectData: { name: string; imageIndex: number } | null;
  onClose: () => void;
}

export default function ProjectInfoCard({ isVisible, projectData, onClose }: ProjectInfoCardProps) {
  return (
    <AnimatePresence>
      {isVisible && projectData && (
        <motion.div 
          className="fixed bg-onsurface-900 rounded-md p-4 text-white z-50"
          style={{
            top: '80px',
            right: '16px',
            width: '300px'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          data-ui="true"
        >
          <div className="flex flex-col gap-24">
            <h3 className="text-body">{projectData.name}</h3>
            <div className="text-sm text-white-700">
              Project #{projectData.imageIndex}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


