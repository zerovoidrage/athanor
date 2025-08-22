'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, NavArrowRightSolid } from 'iconoir-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import UiPortal from '@/components/utils/UiPortal';
import { useAuth } from '@/contexts/AuthContext';

// Функция для генерации описания проекта
const getProjectDescription = (projectName: string): string => {
  const descriptions: { [key: string]: string } = {
    'cryptoflex': 'Flexible cryptocurrency management platform',
    'quantumforge': 'Quantum computing platform for decentralized finance applications',
    'datasphere': 'Blockchain-based data marketplace and analytics platform',
    'omnibase': 'Universal database solution for Web3 applications',
    'smartcontract': 'Automated smart contract deployment and management system',
    'gamehub': 'Decentralized gaming ecosystem and marketplace',
    'neuralverse': 'AI-powered virtual worlds and metaverse platform',
    'visionai': 'Computer vision solutions for blockchain security'
  };
  return descriptions[projectName] || 'Innovative blockchain solution for the future';
};

// Функция для генерации данных проекта
const getProjectData = (projectName: string) => {
  const projectData: { [key: string]: { category: string; stage: string; status: string } } = {
    'cryptoflex': { category: 'FinTech', stage: 'Production', status: 'AI Evaluated' },
    'quantumforge': { category: 'DeFi', stage: 'MVP', status: 'AI Evaluated' },
    'datasphere': { category: 'Data & Analytics', stage: 'Beta', status: 'AI Evaluated' },
    'omnibase': { category: 'Infrastructure', stage: 'Idea', status: 'AI Evaluated' },
    'smartcontract': { category: 'SaaS', stage: 'MVP', status: 'AI Evaluated' },
    'gamehub': { category: 'GameFi', stage: 'Idea', status: 'AI Evaluated' },
    'neuralverse': { category: 'AI & ML', stage: 'Beta', status: 'AI Evaluated' },
    'visionai': { category: 'Cybersecurity', stage: 'MVP', status: 'AI Evaluated' }
  };
  return projectData[projectName] || { category: 'Other', stage: 'Idea', status: 'AI Evaluated' };
};

interface EvaluationProjectInfoCardProps {
  isVisible: boolean;
  projectData: { name: string; imageIndex: number } | null;
  onClose: () => void;
}

export default function EvaluationProjectInfoCard({ isVisible, projectData, onClose }: EvaluationProjectInfoCardProps) {
  const { isAuthenticated } = useAuth();
  const [isManageMode, setIsManageMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

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
            <AnimatePresence mode="wait">
              {!isManageMode && !isDeleteMode ? (
                <motion.div 
                  key="main"
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                >
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
                  <span className="text-small" style={{ color: '#9DFFBA' }}>AI Evaluation (83%)</span>
                </div>
              </div>
              
              {/* Кнопка View AI Evaluation */}
              <div className="pt-4">
                {isAuthenticated ? (
                  <PrimaryButton 
                    onClick={() => console.log('View AI Evaluation:', projectData.name)}
                    className="w-full flex items-center justify-between"
                  >
                    <span>View AI Evaluation</span>
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                ) : (
                  <PrimaryButton 
                    disabled
                    className="w-full flex items-center justify-between opacity-50 cursor-not-allowed"
                  >
                    <span>connect to view evaluation</span>
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                )}
              </div>
              
              {/* Кнопка Project Controls */}
              <div className="pt-2">
                {isAuthenticated ? (
                  <button 
                    onClick={() => setIsManageMode(true)}
                    className="block w-full text-left px-0 py-2 text-sm text-white hover:bg-onsurface-900 hover:px-3 transition-all duration-200 rounded-md flex items-center gap-2"
                  >
                    <NavArrowRightSolid className="w-4 h-4" />
                    <span>Manage {projectData.name}</span>
                  </button>
                ) : (
                  <button 
                    disabled
                    className="block w-full text-left px-0 py-2 text-sm text-sm text-white-700 opacity-50 cursor-not-allowed flex items-center gap-2"
                  >
                    <NavArrowRightSolid className="w-4 h-4" />
                    <span>Manage {projectData.name}</span>
                  </button>
                )}
              </div>
                </motion.div>
              ) : !isDeleteMode ? (
                <motion.div 
                  key="manage"
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Иконка проекта */}
                  <div className="flex justify-end">
                    <div className="w-8 h-8 bg-onsurface-800 flex items-center justify-center overflow-hidden">
                      <img 
                        src={`/img/threejs/abyss/icon${projectData.imageIndex}.jpg`}
                        alt={projectData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Заголовок */}
                  <div className="flex justify-end">
                    <h3 className="text-caption text-white-700">Manage {projectData.name}</h3>
                  </div>
                  
                  {/* Пункты управления */}
                  <div className="flex flex-col items-end gap-0" style={{ marginRight: '-8px' }}>
                    {isAuthenticated ? (
                      <>
                        <button 
                          onClick={() => console.log('Resubmit for AI review:', projectData.name)}
                          className="inline-block text-right py-2 text-subheading text-white hover:bg-onsurface-800 transition-colors px-2 rounded-md"
                        >
                          Resubmit for AI review
                        </button>
                        <button 
                          onClick={() => console.log('Publish on Abyss:', projectData.name)}
                          className="inline-block text-right py-2 text-subheading text-white hover:bg-onsurface-800 transition-colors px-2 rounded-md"
                        >
                          Publish on Abyss
                        </button>
                        <button 
                          onClick={() => setIsDeleteMode(true)}
                          className="inline-block text-right py-2 text-subheading text-white hover:bg-onsurface-800 transition-colors px-2 rounded-md"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          disabled
                          className="inline-block text-right py-2 text-subheading text-white-700 opacity-50 cursor-not-allowed px-2 rounded-md"
                        >
                          Resubmit for AI review
                        </button>
                        <button 
                          disabled
                          className="inline-block text-right py-2 text-subheading text-white-700 opacity-50 cursor-not-allowed px-2 rounded-md"
                        >
                          Publish on Abyss
                        </button>
                        <button 
                          disabled
                          className="inline-block text-right py-2 text-subheading text-white-700 opacity-50 cursor-not-allowed px-2 rounded-md"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Кнопка Exit Manage Mode */}
                  <div className="pt-4 flex justify-end">
                    <PrimaryButton 
                      onClick={() => setIsManageMode(false)}
                      className="w-1/2 flex items-center justify-center"
                    >
                      <span>Exit Manage Mode</span>
                    </PrimaryButton>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="delete"
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Иконка проекта */}
                  <div className="flex justify-end">
                    <div className="w-8 h-8 bg-onsurface-800 flex items-center justify-center overflow-hidden mb-4">
                      <img 
                        src={`/img/threejs/abyss/icon${projectData.imageIndex}.jpg`}
                        alt={projectData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Заголовок */}
                  <div className="flex justify-end mb-2">
                    <h3 className="text-caption text-white-900">Delete {projectData.name}</h3>
                  </div>
                  
                  {/* Вопрос */}
                  <div className="flex justify-end mb-4">
                    <p className="text-small text-white-700 text-right">
                      Are you sure you want to delete this project?
                    </p>
                  </div>
                  
                  {/* Кнопки Да/Нет */}
                  <div className="flex justify-end gap-2">
                    <SecondaryButton 
                      onClick={() => setIsDeleteMode(false)}
                    >
                      No
                    </SecondaryButton>
                    <SecondaryButton 
                      onClick={() => {
                        console.log('Delete confirmed:', projectData.name);
                        setIsDeleteMode(false);
                        setIsManageMode(false);
                      }}
                    >
                      Yes
                    </SecondaryButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </UiPortal>
  );
}
