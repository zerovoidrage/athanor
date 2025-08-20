'use client';

import React from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Key } from 'iconoir-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import UiPortal from '@/components/utils/UiPortal';
import { useAuth } from '@/contexts/AuthContext';

// Функция для генерации score для каждого проекта
const getProjectScore = (projectName: string): number => {
  const scores: { [key: string]: number } = {
    'quantumforge': 87,
    'datasphere': 92,
    'omnibase': 78,
    'blockchain': 85,
    'smartcontract': 91,
    'gamehub': 76,
    'neuralverse': 89,
    'visionai': 83,
    'cryptoflex': 94
  };
  return scores[projectName] || Math.floor(Math.random() * 51) + 50;
};

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
    'cryptoflex': 'Flexible cryptocurrency management and trading platform'
  };
  return descriptions[projectName] || 'Innovative blockchain solution for the future';
};

// Функция для генерации данных проекта
const getProjectData = (projectName: string) => {
  const projectData: { [key: string]: { category: string; stage: string; raised: string } } = {
    'quantumforge': { category: 'DeFi', stage: 'MVP', raised: '125 000 from 500 000 USDT' },
    'datasphere': { category: 'Data & Analytics', stage: 'Beta', raised: '89 000 from 500 000 USDT' },
    'omnibase': { category: 'Infrastructure', stage: 'Idea', raised: '0 from 500 000 USDT' },
    'blockchain': { category: 'Developer Tooling', stage: 'Production', raised: '342 000 from 500 000 USDT' },
    'smartcontract': { category: 'SaaS', stage: 'MVP', raised: '67 000 from 500 000 USDT' },
    'gamehub': { category: 'GameFi', stage: 'Idea', raised: '0 from 500 000 USDT' },
    'neuralverse': { category: 'AI & ML', stage: 'Beta', raised: '156 000 from 500 000 USDT' },
    'visionai': { category: 'Cybersecurity', stage: 'MVP', raised: '78 000 from 500 000 USDT' },
    'cryptoflex': { category: 'FinTech', stage: 'Production', raised: '289 000 from 500 000 USDT' }
  };
  return projectData[projectName] || { category: 'Other', stage: 'Idea', raised: '0 from 500 000 USDT' };
};

interface ProjectInfoCardProps {
  isVisible: boolean;
  projectData: { name: string; imageIndex: number } | null;
  onClose: () => void;
}

export default function ProjectInfoCard({ isVisible, projectData, onClose }: ProjectInfoCardProps) {
  const [displayScore, setDisplayScore] = React.useState(0);
  const targetScore = getProjectScore(projectData?.name || '');
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isVisible && projectData) {
      setDisplayScore(0);
      const startTime = Date.now();
      const duration = 800; // 800ms вместо ~2 секунд
      
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing функция: easeOutQuart для более кривой анимации
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        const currentScore = Math.round(targetScore * easedProgress);
        
        setDisplayScore(currentScore);
        
        if (progress >= 1) {
          clearInterval(timer);
        }
      }, 16); // 60fps для более плавной анимации
      
      return () => clearInterval(timer);
    }
  }, [isVisible, projectData, targetScore]);

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
              
              {/* Score эллипс на всю ширину */}
              <div className="flex justify-center">
                <div className="relative w-[380px] h-[380px]">
                  <svg className="w-[380px] h-[380px] transform -rotate-90" viewBox="0 0 100 100">
                    {/* Неактивная линия */}
                    <ellipse
                      cx="50" cy="50" rx="35" ry="35"
                      stroke="#FFFFFF1C"
                      strokeWidth="0.5"
                      fill="none"
                    />
                    {/* Активная линия */}
                    <motion.ellipse
                      cx="50" cy="50" rx="35" ry="35"
                      stroke="white"
                      strokeWidth="0.5"
                      fill="none"
                      strokeDasharray="220"
                      strokeDashoffset="220"
                      initial={{ strokeDashoffset: 220 }}
                      animate={{ strokeDashoffset: 220 * (1 - getProjectScore(projectData.name) / 100) }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-number text-white mb-3">
                      {displayScore}%
                    </span>
                    <span className="text-small text-white-700">score</span>
                  </div>
                </div>
              </div>
              
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
                  <span className="text-small text-white-700 w-[100px]">Stage:</span>
                  <span className="text-small text-white-900">{getProjectData(projectData.name).stage}</span>
                </div>
                <div className="flex gap-0">
                  <span className="text-small text-white-700 w-[100px]">Raised:</span>
                  <span className="text-small text-white-900">{getProjectData(projectData.name).raised}</span>
                </div>
              </div>
              
              {/* Кнопка */}
              <div className="pt-4">
                {isAuthenticated ? (
                  <PrimaryButton 
                    onClick={() => console.log('Open project:', projectData.name)}
                    className="w-full flex items-center justify-between"
                  >
                    <span>open</span>
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                ) : (
                  <PrimaryButton 
                    disabled
                    className="w-full flex items-center justify-between opacity-50 cursor-not-allowed"
                  >
                    <span>connect to view project</span>
                    <Key className="w-4 h-4" />
                  </PrimaryButton>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </UiPortal>
  );
}


