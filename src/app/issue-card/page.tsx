'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ArrowRight, Xmark } from 'iconoir-react';
import ThreeJSCard from '@/components/ThreeJSCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Spinner from '@/components/ui/Spinner';

// Компонент для анимированных точек
const AnimatedDots: React.FC = () => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
};


interface CardType {
  id: string;
  name: string;
  tabName: string;
  price: number;
  description: string;
  benefits: string[];
  gradient: string;
}

const cardTypes: CardType[] = [
  {
    id: 'free',
    name: 'FreeCard',
    tabName: 'Free',
    price: 0,
    description: 'Perfect for getting started with your investment journey. Basic access to curated projects.',
    benefits: [
      'Access to basic project information',
      'Standard investment opportunities',
      'Community support',
      'Email notifications'
    ],
    gradient: 'url(/gpt.png)'
  },
  {
    id: 'angel',
    name: 'AngelCard',
    tabName: 'Angel',
    price: 50,
    description: 'Enhanced features for serious investors. Get priority access and detailed analytics.',
    benefits: [
      'Priority access to new projects',
      'Detailed project analytics',
      'Direct founder communication',
      'Exclusive investment rounds',
      'Advanced portfolio tracking'
    ],
    gradient: 'url(/gpt.png)'
  },
  {
    id: 'scout',
    name: 'ScoutCard',
    tabName: 'Scout',
    price: 100,
    description: 'Premium access for professional investors. Full platform capabilities and exclusive benefits.',
    benefits: [
      'All AngelCard features',
      'Early access to pre-seed rounds',
      'Personal investment advisor',
      'Custom deal flow',
      'VIP community access',
      'Quarterly strategy sessions'
    ],
    gradient: 'url(/gpt.png)'
  }
];

export default function IssueCardPage() {
  const router = useRouter();
  const { displayName, updateUserRole } = useAuth();
  const [selectedCard, setSelectedCard] = useState<CardType>(cardTypes[0]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Имитация загрузки страницы
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800); // 0.8 секунды загрузки

    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    router.back();
  };

  const handleCardSelect = (card: CardType) => {
    if (card.id !== selectedCard.id) {
      setSelectedCard(card);
    }
  };

  const handleIssueCard = () => {
    if (selectedCard.price === 0) {
      // Free card - go directly to processing
      setIsProcessing(true);
      setTimeout(() => {
        updateUserRole('investor');
        setIsProcessing(false);
        setIsSuccess(true);
      }, 3000);
    } else {
      // Paid card - show payment modal
      setIsPaymentModalOpen(true);
    }
  };

  const handlePayment = () => {
    setIsPaymentModalOpen(false);
    setIsProcessing(true);
    setTimeout(() => {
      updateUserRole('investor');
      setIsProcessing(false);
      setIsSuccess(true);
    }, 3000);
  };

  const handleOpenVault = () => {
    router.push('/vault');
  };





  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto" />
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <div className="text-white-900 text-caption">Please wait a bit, we are already releasing the card<AnimatedDots /></div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-display text-white mb-4">Congratz!</h1>
          <p className="text-caption text-white-700 mb-8 max-w-md">
            Your card has been successfully issued! You're now ready to explore exclusive investment opportunities.
          </p>
          <div className="flex justify-center">
            <PrimaryButton
              onClick={handleOpenVault}
              className="bg-white text-black hover:bg-white-900"
            >
              Open my Vault
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content - Full Width and Height */}
      <div className="min-h-screen flex">
        {/* Left Side - 50% */}
        <motion.div 
          className="w-1/2 pt-[100px] px-[100px] pb-0 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.5
          }}
        >
          {/* Back to Vault Button */}
          <div className="mb-16">
            <button
              onClick={handleCancel}
              className="flex items-center text-white-700 hover:text-white-900 text-callout transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vault
            </button>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-display text-white mb-4">Choose Your Card</h1>
            <p className="text-caption text-white-700 w-80">
              Select the card that best fits your investment needs and unlock exclusive opportunities
            </p>
          </div>

          {/* Card Selection Tabs */}
          <div className="mb-8">
            <div className="rounded-lg p-0.5">
              <div className="flex">
                {cardTypes.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardSelect(card)}
                    className={`flex-1 p-2 rounded-md transition-all text-center ${
                      selectedCard.id === card.id
                        ? 'bg-onsurface-800 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="text-callout">{card.tabName}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card Description */}
          <div className="flex-1">
            <div className="bg-white/5 rounded-lg mt-6 mb-14">
              <h3 className="text-subheading text-white mb-4">{selectedCard.name}</h3>
              <p className="text-caption text-white-700 mb-12 w-80">{selectedCard.description}</p>
              <h4 className="text-subheading text-white mb-8">Unique Benefits:</h4>
              <ul className="space-y-1">
                {selectedCard.benefits.map((benefit, index) => (
                  <li key={index} className="text-body text-white-700 flex items-start">
                    <span className="text-white mr-4">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Issue Button */}
            <PrimaryButton
              onClick={handleIssueCard}
              className="w-full justify-between"
            >
              <span>{selectedCard.price === 0 ? 'Issue FreeCard' : `Issue ${selectedCard.name} for ${selectedCard.price} USDT`}</span>
              <ArrowRight className="w-4 h-4" />
            </PrimaryButton>
          </div>
        </motion.div>

                {/* Right Side - 50% */}
        <motion.div 
          className="w-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.5,
            delay: 0.2
          }}
        >
          <div className="h-full p-4">
            <div 
              className="h-full overflow-hidden relative w-full rounded-lg transition-all duration-500"
              style={{ 
                background: selectedCard.gradient,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCard.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    className="w-full h-full"
                  >
                    <ThreeJSCard 
                      width="100%" 
                      height="100%" 
                      cardType={selectedCard.id as 'free' | 'angel' | 'scout'}
                    />
                  </motion.div>
                </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center z-50"
            onClick={() => setIsPaymentModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 200,
                duration: 0.3
              }}
              className="bg-onsurface-900 rounded-lg p-8 max-w-md w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white-700 hover:text-white transition-colors duration-200"
                aria-label="Close modal"
              >
                <Xmark width={20} height={20} />
              </button>

              <div className="text-center">
                <h3 className="text-heading text-white mb-8">(payment methods)</h3>
                <PrimaryButton
                  onClick={handlePayment}
                  className="w-full justify-between"
                >
                  <span>Pay {selectedCard.price} USDT and Issue</span>
                  <ArrowRight className="w-4 h-4" />
                </PrimaryButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
