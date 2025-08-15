'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  NavArrowDownSolid,
  Play
} from 'iconoir-react';

// Компоненты для каждой страницы
const MasterTermsOfService = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-heading mb-12">Master Terms of Service</h1>
    <div className="space-y-6 text-white-700">
      <section>
        <h2 className="text-subheading mb-3 text-white-900">1. Acceptance of Terms</h2>
        <p>By accessing and using Athanor platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
      </section>
      <section>
        <h2 className="text-subheading mb-3 text-white-900">2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials on Athanor's website for personal, non-commercial transitory viewing only.</p>
      </section>
      <section>
        <h2 className="text-subheading mb-3 text-white-900">3. Disclaimer</h2>
        <p>The materials on Athanor's website are provided on an 'as is' basis. Athanor makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
      </section>
    </div>
  </div>
);

const PrivacyPolicy = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-heading mb-12">Privacy Policy</h1>
    <div className="space-y-6 text-white-700">
      <section>
        <h2 className="text-subheading mb-3 text-white-900">Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, make a transaction, or contact us for support.</p>
      </section>
      <section>
        <h2 className="text-subheading mb-3 text-white-900">How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
      </section>
      <section>
        <h2 className="text-subheading mb-3 text-white-900">Information Sharing</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
      </section>
    </div>
  </div>
);

const TokenizedPromiseAgreement = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-heading mb-12">Tokenized Promise Agreement (TPA) [Template]</h1>
    <div className="space-y-6 text-white-700">
      <section>
        <h2 className="text-subheading mb-3 text-white-900">Agreement Overview</h2>
        <p>This Tokenized Promise Agreement establishes the terms and conditions for the tokenization of promises and commitments between parties on the Athanor platform.</p>
      </section>
      <section>
        <h2 className="text-subheading mb-3 text-white-900">Tokenization Process</h2>
        <p>Promises are converted into digital tokens that represent the commitment and can be tracked, transferred, and enforced through smart contracts.</p>
      </section>
      <section>
        <h2 className="text-subheading mb-3 text-white-900">Enforcement Mechanisms</h2>
        <p>Smart contracts automatically execute predefined actions based on the fulfillment or breach of tokenized promises.</p>
      </section>
    </div>
  </div>
);

const FAQ = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const faqData = {
    general: [
      { q: "What is Athanor?", a: "Athanor is a platform for tokenizing promises and commitments between parties." },
      { q: "How does the platform work?", a: "Users can create, manage, and track tokenized agreements through smart contracts." },
      { q: "Is my data secure?", a: "Yes, we use industry-standard encryption and security measures to protect your data." }
    ],
    investor: [
      { q: "How do I start investing?", a: "Create an account, complete KYC verification, and connect your wallet to begin investing." },
      { q: "What are the minimum investment amounts?", a: "Minimum investment amounts vary by project and are clearly stated in each offering." },
      { q: "How do I track my investments?", a: "All your investments are visible in your dashboard with real-time updates." }
    ],
    founder: [
      { q: "How do I create a project?", a: "Navigate to the launchpad, fill out the project details, and submit for review." },
      { q: "What documents do I need?", a: "You'll need business plan, financial projections, and legal documentation." },
      { q: "How long does approval take?", a: "Project approval typically takes 3-5 business days after submission." }
    ],
    advisor: [
      { q: "How do I become an advisor?", a: "Apply through the advisor portal with your credentials and experience." },
      { q: "What are my responsibilities?", a: "Advisors provide guidance to projects and help ensure their success." },
      { q: "How do I get compensated?", a: "Compensation varies by project and is outlined in your advisor agreement." }
    ],
    ambassador: [
      { q: "What does an ambassador do?", a: "Ambassadors promote the platform and help onboard new users." },
      { q: "How do I apply?", a: "Submit an application through the ambassador program portal." },
      { q: "What are the benefits?", a: "Ambassadors receive rewards and exclusive access to platform features." }
    ]
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'investor', label: 'Investor' },
    { id: 'founder', label: 'Founder' },
    { id: 'advisor', label: 'Advisor' },
    { id: 'ambassador', label: 'Ambassador' }
  ];

  const toggleItem = (itemKey: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        // Если элемент уже открыт - сворачиваем его
        newSet.delete(itemKey);
      } else {
        // Если элемент закрыт - сначала очищаем все, потом открываем только этот
        newSet.clear();
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-heading mb-12">Frequently Asked Questions</h1>
      
      {/* Tabs */}
      <div className="flex space-x-1 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white-900 text-black'
                : 'text-white-700 hover:text-white-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQ Content */}
      <div className="bg-onsurface-900 rounded-lg p-1">
        <div className="space-y-1">
          {faqData[activeTab as keyof typeof faqData].map((item, index) => {
            const itemKey = `${activeTab}-${index}`;
            const isExpanded = expandedItems.has(itemKey);
            
            return (
              <div key={index} className="rounded-lg overflow-hidden">
                <button
                  className={`w-full px-4 py-4 flex items-center justify-between text-left hover:bg-onsurface-900 transition-colors ${
                    isExpanded ? 'rounded-b-lg' : ''
                  }`}
                  onClick={() => toggleItem(itemKey)}
                >
                  <div className="flex-1">
                    <h3 className="text-caption text-white-900">{item.q}</h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-white-700 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4 rounded-b-lg">
                    <div className="pt-4">
                      <p className="text-white-700 text-caption leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const HowTo = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const howToData = [
    {
      id: 'create-product',
      title: 'How to Create a Product',
      steps: [
        'Navigate to the Launchpad section',
        'Click "Create New Project"',
        'Fill out all required information',
        'Upload necessary documents',
        'Submit for review'
      ],
      video: 'Video Tutorial: Creating Your First Project'
    },
    {
      id: 'invest',
      title: 'How to Invest',
      steps: [
        'Browse available projects in the Marketplace',
        'Review project details and documentation',
        'Connect your wallet',
        'Enter investment amount',
        'Confirm transaction'
      ],
      video: 'Video Tutorial: Making Your First Investment'
    },
    {
      id: 'transfer-money',
      title: 'How to Transfer Money',
      steps: [
        'Go to your Wallet section',
        'Select "Send" or "Receive"',
        'Enter recipient address or scan QR code',
        'Specify amount and currency',
        'Confirm transaction'
      ],
      video: 'Video Tutorial: Secure Money Transfers'
    }
  ];

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        // Если элемент уже открыт - сворачиваем его
        newSet.delete(itemId);
      } else {
        // Если элемент закрыт - сначала очищаем все, потом открываем только этот
        newSet.clear();
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-heading mb-12">How-To Guides</h1>
      
      <div className="bg-onsurface-900 rounded-lg p-1">
        <div className="space-y-1">
          {howToData.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            
            return (
              <div key={item.id} className="rounded-lg overflow-hidden">
                <button
                  className={`w-full px-4 py-4 flex items-center justify-between text-left hover:bg-onsurface-900 transition-colors ${
                    isExpanded ? 'rounded-b-lg' : ''
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex-1">
                    <h3 className="text-caption text-white-900">{item.title}</h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-white-700 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4 rounded-b-lg">
                    <div className="pt-4">
                      <div className="space-y-4 text-white-700 mb-4">
                        {item.steps.map((step, index) => (
                          <p key={index}>{index + 1}. {step}</p>
                        ))}
                      </div>
                      <div className="p-4 bg-black rounded-lg">
                        <div className="flex items-center gap-2 text-white-700">
                          <Play className="w-4 h-4" />
                          <span>{item.video}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MutualNDA = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-heading mb-12">Mutual NDA [Template]</h1>
    <div className="space-y-6 text-white-700">
      <section>
        <h2 className="text-subheading mb-3 text-white-900">Confidentiality Agreement</h2>
        <p>This Mutual Non-Disclosure Agreement establishes the terms and conditions for the protection of confidential information shared between parties on the Athanor platform.</p>
      </section>
      <section>
        <h2 className="text-subheading mb-3 text-white-900">Definition of Confidential Information</h2>
        <p>Confidential information includes, but is not limited to, business plans, financial data, technical specifications, and any other proprietary information shared between parties.</p>
      </section>
      <section>
        <h2 className="text-subheading mb-3 text-white-900">Obligations</h2>
        <p>Each party agrees to maintain the confidentiality of the other party's information and to use such information solely for the purpose of evaluating potential business relationships.</p>
      </section>
    </div>
  </div>
);

export default function KnowledgeBasePage() {
  const [activePage, setActivePage] = useState('tos');
  const router = useRouter();

  // Скрываем глобальный хедер на этой странице
  useEffect(() => {
    const globalHeader = document.querySelector('header');
    if (globalHeader) {
      globalHeader.style.display = 'none';
    }

    return () => {
      if (globalHeader) {
        globalHeader.style.display = '';
      }
    };
  }, []);

  const menuItems = [
    { id: 'tos', label: 'ToS' },
    { id: 'privacy', label: 'PP' },
    { id: 'tpa', label: 'TPA [Template]' },
    { id: 'faq', label: 'FAQ' },
    { id: 'howto', label: 'How-To' },
    { id: 'nda', label: 'Mutual NDA [Template]' }
  ];

  const renderContent = () => {
    switch (activePage) {
      case 'tos': return <MasterTermsOfService />;
      case 'privacy': return <PrivacyPolicy />;
      case 'tpa': return <TokenizedPromiseAgreement />;
      case 'faq': return <FAQ />;
      case 'howto': return <HowTo />;
      case 'nda': return <MutualNDA />;
      default: return <MasterTermsOfService />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 text-white w-full p-4 z-50 bg-transparent select-none">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div 
              className="cursor-pointer select-none"
              onClick={() => router.push('/')}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector('span')!.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector('span')!.style.color = '#B3B3B3';
              }}
            >
              <span className="text-subheading transition-colors duration-200 flex items-center gap-4 select-none" style={{ color: '#B3B3B3' }}>
                athanor
                <span>/</span>
              </span>
            </div>
            
            <div className="flex items-start">
              <span className="text-subheading">
                knowledge base
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16">
        <div className="flex">
          {/* Sidebar Menu - прижато к левому краю */}
          <div className="w-80 flex-shrink-0 pl-2">
            <div className="sticky top-0">
              <nav className="space-y-0">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full text-left px-2 py-2 text-caption transition-colors rounded-md ${
                      activePage === item.id
                        ? 'bg-onsurface-800 text-white-900'
                        : 'text-white-700 hover:bg-onsurface-800 hover:text-white-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area - по центру */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-4xl px-4 min-h-[calc(100vh-120px)]">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white h-full"
              >
                {renderContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
