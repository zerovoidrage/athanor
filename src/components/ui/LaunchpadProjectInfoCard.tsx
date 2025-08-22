'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'iconoir-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import UiPortal from '@/components/utils/UiPortal';
import { useAuth } from '@/contexts/AuthContext';

// Функция для генерации описания проекта
const getProjectDescription = (projectName: string): string => {
  const descriptions: { [key: string]: string } = {
    'quantumforge': 'Quantum computing platform for decentralized finance applications',
    'datasphere': 'Blockchain-based data marketplace and analytics platform',
    'omnibase': 'Universal database solution for Web3 applications',
    'blockchain': 'Next-generation blockchain infrastructure and development tools',
    'smartcontract': 'Automated smart contract deployment and management system',
    'gamehub': 'Decentralized gaming ecosystem and marketplace',
    'neuralverse': 'AI-powered virtual worlds and metaverse platform',
    'visionai': 'Computer vision solutions for blockchain security',
    'cryptoflex': 'Flexible cryptocurrency management and trading platform',
    'metaverse': 'Next-generation metaverse platform with AI integration',
    'defi': 'Decentralized finance protocol for yield farming and lending'
  };
  return descriptions[projectName] || 'Innovative blockchain solution for the future';
};

// Функция для генерации данных проекта
const getProjectData = (projectName: string) => {
  const projectData: { [key: string]: { category: string; stage: string; status: string } } = {
    'quantumforge': { category: 'DeFi', stage: 'MVP', status: 'draft' },
    'datasphere': { category: 'Data & Analytics', stage: 'Beta', status: 'draft' },
    'omnibase': { category: 'Infrastructure', stage: 'Idea', status: 'draft' },
    'blockchain': { category: 'Developer Tooling', stage: 'Production', status: 'draft' },
    'smartcontract': { category: 'SaaS', stage: 'MVP', status: 'draft' },
    'gamehub': { category: 'GameFi', stage: 'Idea', status: 'draft' },
    'neuralverse': { category: 'AI & ML', stage: 'Beta', status: 'draft' },
    'visionai': { category: 'Cybersecurity', stage: 'MVP', status: 'draft' },
    'cryptoflex': { category: 'FinTech', stage: 'Production', status: 'draft' },
    'gamehub': { category: 'GameFi', stage: 'Beta', status: 'draft' },
    'metaverse': { category: 'Metaverse', stage: 'Alpha', status: 'draft' },
    'defi': { category: 'DeFi', stage: 'Idea', status: 'draft' }
  };
  return projectData[projectName] || { category: 'Other', stage: 'Idea', status: 'draft' };
};

interface LaunchpadProjectInfoCardProps {
  isVisible: boolean;
  projectData: { name: string; imageIndex: number } | null;
  onClose: () => void;
}

export default function LaunchpadProjectInfoCard({ isVisible, projectData, onClose }: LaunchpadProjectInfoCardProps) {
  const { isAuthenticated } = useAuth();

  return (
    <UiPortal>
      <AnimatePresence>
        {isVisible && projectData && (
          <motion.div 
            className="fixed rounded-md p-4 text-white z-[100] project-info-card"
            style={{
              top: '40px',
              right: '16px',
              width: '380px',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              filter: 'none !important'
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ 
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { duration: 0.3 },
              y: { duration: 0.5 },
              scale: { duration: 0.4 }
            }}
            data-ui="true"
          >
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-onsurface-800 flex items-center justify-center overflow-hidden">
                <img 
                  src={`/img/threejs/abyss/icon${projectData.imageIndex}.jpg`}
                  alt={projectData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-body">{projectData.name}</h3>
              
              <p className="text-small text-white-700 leading-relaxed w-[70%]">
                {getProjectDescription(projectData.name)}
              </p>
              
              {/* Параметры проекта */}
              <div className="space-y-2">
                <div className="flex gap-0">
                  <span className="text-small text-white-700 w-[100px]">Category:</span>
                  <span className="text-small text-white-900">{getProjectData(projectData.name).category}</span>
                </div>
                <div className="flex gap-0">
                  <span className="text-small text-white-700 w-[100px]">Status:</span>
                  <span className="text-small" style={{ color: '#F0CCA6' }}>{getProjectData(projectData.name).status}</span>
                </div>
              </div>
              
              {/* Кнопка Complete draft */}
              <div className="pt-4">
                {isAuthenticated ? (
                  <PrimaryButton 
                    onClick={() => console.log('Complete draft project:', projectData.name)}
                    className="w-full flex items-center justify-between"
                  >
                    <span>Complete draft</span>
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                ) : (
                  <PrimaryButton 
                    disabled
                    className="w-full flex items-center justify-between opacity-50 cursor-not-allowed"
                  >
                    <span>connect to manage project</span>
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                )}
              </div>
              
              {/* Кнопка Delete */}
              <div className="pt-2">
                {isAuthenticated ? (
                  <button 
                    onClick={() => console.log('Delete project:', projectData.name)}
                    className="block w-full text-left px-0 py-2 text-sm text-white hover:bg-onsurface-900 hover:px-3 transition-all duration-200 rounded-md"
                  >
                    Delete
                  </button>
                ) : (
                  <button 
                    disabled
                    className="block w-full text-left px-0 py-2 text-sm text-white-700 opacity-50 cursor-not-allowed"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </UiPortal>
  );
}
