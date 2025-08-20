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
          className="fixed rounded-md p-4 text-white z-50"
          style={{
            top: '80px',
            right: '16px',
            width: '300px',
            backgroundColor: '#1B1B1B'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          data-ui="true"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-onsurface-800 rounded-md flex items-center justify-center overflow-hidden">
                <img 
                  src={`/img/threejs/${projectData.imageIndex}.jpg`}
                  alt={projectData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-body">{projectData.name}</h3>
            </div>
            <div className="text-sm text-white-700">
              Project #{projectData.imageIndex}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


