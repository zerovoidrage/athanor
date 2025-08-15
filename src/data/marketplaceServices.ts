export interface BaseService {
  id: number;
  title: string;
  deliveries: number;
  categories: string[];
  customTiers: {
    id: string;
    name: string;
    description: string;
    price: string;
    features: string[];
  }[];
}

// Функция для создания дефолтных тиров
const createDefaultTiers = (serviceTitle: string) => [
  {
    id: `${serviceTitle.toLowerCase().replace(/\s+/g, '-')}-basic`,
    name: 'Basic Package',
    description: `Essential ${serviceTitle.toLowerCase()} service`,
    price: '$299',
    features: [
      'Core service delivery',
      'Basic consultation',
      'Standard turnaround time',
      'Email support'
    ]
  },
  {
    id: `${serviceTitle.toLowerCase().replace(/\s+/g, '-')}-pro`,
    name: 'Pro Package',
    description: `Advanced ${serviceTitle.toLowerCase()} with premium features`,
    price: '$599',
    features: [
      'Advanced service features',
      'Priority consultation',
      'Fast turnaround time',
      'Phone support',
      'Follow-up sessions'
    ]
  }
];

// Функция для создания расширенных тиров (6-7 тиров)
const createExtendedTiers = (serviceTitle: string) => [
  {
    id: `${serviceTitle.toLowerCase().replace(/\s+/g, '-')}-starter`,
    name: 'Starter',
    description: `Perfect for beginners in ${serviceTitle.toLowerCase()}`,
    price: '$99',
    features: [
      'Basic consultation',
      'Essential guidance',
      'Email support',
      '5-day delivery'
    ]
  },
  {
    id: `${serviceTitle.toLowerCase().replace(/\s+/g, '-')}-basic`,
    name: 'Basic',
    description: `Standard ${serviceTitle.toLowerCase()} service`,
    price: '$199',
    features: [
      'Core service delivery',
      'Basic consultation',
      'Standard turnaround time',
      'Email support',
      '1 revision'
    ]
  },
  {
    id: `${serviceTitle.toLowerCase().replace(/\s+/g, '-')}-standard`,
    name: 'Standard',
    description: `Professional ${serviceTitle.toLowerCase()} with enhanced features`,
    price: '$399',
    features: [
      'Advanced service features',
      'Priority consultation',
      'Fast turnaround time',
      'Phone support',
      '3 revisions',
      'Follow-up session'
    ]
  },
  {
    id: `${serviceTitle.toLowerCase().replace(/\s+/g, '-')}-pro`,
    name: 'Professional',
    description: `Premium ${serviceTitle.toLowerCase()} with expert guidance`,
    price: '$699',
    features: [
      'Expert-level service',
      'Priority consultation',
      'Express delivery',
      'Dedicated support',
      'Unlimited revisions',
      'Follow-up sessions',
      'Custom solutions'
    ]
  },
  {
    id: `${serviceTitle.toLowerCase().replace(/\s+/g, '-')}-premium`,
    name: 'Premium',
    description: `Elite ${serviceTitle.toLowerCase()} with comprehensive support`,
    price: '$999',
    features: [
      'Elite service delivery',
      '24/7 consultation',
      'Same-day delivery',
      'Personal manager',
      'Unlimited revisions',
      'Ongoing support',
      'Custom solutions',
      'Priority access'
    ]
  },
  {
    id: `${serviceTitle.toLowerCase().replace(/\s+/g, '-')}-enterprise`,
    name: 'Enterprise',
    description: `Enterprise-grade ${serviceTitle.toLowerCase()} solution`,
    price: '$1,499',
    features: [
      'Enterprise service package',
      'Dedicated team',
      'Custom timeline',
      'Executive support',
      'Unlimited revisions',
      'Ongoing partnership',
      'Custom integrations',
      'Priority access',
      'White-label options'
    ]
  },
  {
    id: `${serviceTitle.toLowerCase().replace(/\s+/g, '-')}-ultimate`,
    name: 'Ultimate',
    description: `Ultimate ${serviceTitle.toLowerCase()} experience`,
    price: '$2,499',
    features: [
      'Ultimate service package',
      'VIP consultation',
      'Instant delivery',
      'Personal assistant',
      'Unlimited everything',
      'Lifetime support',
      'Custom development',
      'Exclusive access',
      'White-label solutions',
      'Revenue sharing'
    ]
  }
];

export const ALL_SERVICES: BaseService[] = [
  // Top Services (30+ delivered)
  { 
    id: 1, 
    title: 'Pitch Deck Review + AI Rewrite', 
    deliveries: 45, 
    categories: ['Fundraising'],
    customTiers: [
      {
        id: 'basic-review',
        name: 'Basic Review',
        description: 'Essential pitch deck analysis and feedback',
        price: '$299',
        features: [
          'Comprehensive deck review',
          'Structure optimization',
          'Key messaging feedback',
          '3 revision rounds'
        ]
      },
      {
        id: 'ai-rewrite',
        name: 'AI Rewrite',
        description: 'Complete AI-powered content rewrite',
        price: '$599',
        features: [
          'Full AI content rewrite',
          'Market positioning optimization',
          'Investor-focused messaging',
          'Unlimited revisions',
          'Presentation coaching'
        ]
      },
      {
        id: 'premium-package',
        name: 'Premium Package',
        description: 'Complete pitch deck transformation',
        price: '$999',
        features: [
          'AI rewrite + design overhaul',
          'Financial model integration',
          'Investor presentation coaching',
          'Follow-up support',
          'Priority delivery'
        ]
      }
    ]
  },
  { 
    id: 2, 
    title: 'Growth Hacking / GTM Strategy', 
    deliveries: 42, 
    categories: ['PR & Marketing'],
    customTiers: [
      {
        id: 'strategy-audit',
        name: 'Strategy Audit',
        description: 'Comprehensive growth strategy analysis',
        price: '$399',
        features: [
          'Current strategy review',
          'Market opportunity analysis',
          'Competitive landscape',
          'Growth recommendations'
        ]
      },
      {
        id: 'gtm-implementation',
        name: 'GTM Implementation',
        description: 'Full go-to-market strategy execution',
        price: '$799',
        features: [
          'Complete GTM strategy',
          'Channel optimization',
          'Customer acquisition plan',
          'Performance tracking setup',
          '3 months support'
        ]
      },
      {
        id: 'growth-acceleration',
        name: 'Growth Acceleration',
        description: 'Advanced growth hacking techniques',
        price: '$1,299',
        features: [
          'Advanced growth tactics',
          'A/B testing framework',
          'Viral mechanics implementation',
          'Scalable growth model',
          '6 months support'
        ]
      }
    ]
  },
  { 
    id: 3, 
    title: 'Customer Acquisition Strategy', 
    deliveries: 38, 
    categories: ['Growth'],
    customTiers: [
      {
        id: 'acquisition-audit',
        name: 'Acquisition Audit',
        description: 'Current customer acquisition analysis',
        price: '$299',
        features: [
          'Channel performance review',
          'Customer journey analysis',
          'Conversion optimization tips',
          'ROI improvement plan'
        ]
      },
      {
        id: 'acquisition-strategy',
        name: 'Acquisition Strategy',
        description: 'Complete customer acquisition plan',
        price: '$599',
        features: [
          'Multi-channel strategy',
          'Customer persona development',
          'Acquisition funnel design',
          'Performance metrics setup'
        ]
      }
    ]
  },
  { id: 4, title: 'Web3 Legal Setup (US, Estonia, BVI)', deliveries: 35, categories: ['Legal & Compliance'], customTiers: createExtendedTiers('Web3 Legal Setup') },
  { id: 5, title: 'No-Code MVP Builder', deliveries: 33, categories: ['MVP Building'], customTiers: createExtendedTiers('No-Code MVP Builder') },
  { id: 6, title: 'Smart Contract Audit', deliveries: 32, categories: ['Legal & Compliance'], customTiers: createExtendedTiers('Smart Contract Audit') },
  { id: 7, title: 'API Development & Integration', deliveries: 30, categories: ['Infrastructure'], customTiers: createExtendedTiers('API Development') },
  { id: 8, title: 'Conversion Rate Optimization', deliveries: 29, categories: ['Growth'], customTiers: createExtendedTiers('Conversion Rate Optimization') },
  { id: 9, title: 'Social Media Strategy', deliveries: 28, categories: ['PR & Marketing'], customTiers: createExtendedTiers('Social Media Strategy') },
  { id: 10, title: 'Tokenomics Modeling & Simulation', deliveries: 27, categories: ['Fundraising'], customTiers: createExtendedTiers('Tokenomics Modeling') },
  { id: 11, title: 'Product Roadmap + AI Spec Pack', deliveries: 26, categories: ['Infrastructure'], customTiers: createExtendedTiers('Product Roadmap') },
  { id: 12, title: 'Market Research & Validation', deliveries: 25, categories: ['Growth'], customTiers: createExtendedTiers('Market Research') },
  { id: 13, title: 'Cloud Infrastructure Setup', deliveries: 24, categories: ['Infrastructure'], customTiers: createExtendedTiers('Cloud Infrastructure') },
  { id: 14, title: 'Brand Identity & Messaging', deliveries: 23, categories: ['PR & Marketing'], customTiers: createExtendedTiers('Brand Identity') },
  { id: 15, title: 'Investor List & Intro Service', deliveries: 22, categories: ['Fundraising'], customTiers: createExtendedTiers('Investor List') },

  // High Demand Services (20-29 delivered)
  { id: 16, title: 'Content Marketing Campaign', deliveries: 21, categories: ['PR & Marketing'] },
  { id: 17, title: 'Retention & Engagement Optimization', deliveries: 20, categories: ['Growth'] },
  { id: 18, title: 'Prototype Development', deliveries: 19, categories: ['MVP Building'] },
  { id: 19, title: 'Custom KYC / AML Platform', deliveries: 18, categories: ['Infrastructure'] },
  { id: 20, title: 'Competitive Analysis', deliveries: 17, categories: ['Growth'] },
  { id: 21, title: 'DevOps & CI/CD Pipeline', deliveries: 16, categories: ['Infrastructure'] },
  { id: 22, title: 'Revenue Model Optimization', deliveries: 15, categories: ['Growth'] },
  { id: 23, title: 'Performance Marketing Setup', deliveries: 14, categories: ['Growth'] },
  { id: 24, title: 'SEO & Analytics Setup', deliveries: 13, categories: ['PR & Marketing'] },
  { id: 25, title: 'Product Launch Strategy', deliveries: 12, categories: ['PR & Marketing'] },
  { id: 26, title: 'User Testing & Feedback', deliveries: 11, categories: ['MVP Building'] },
  { id: 27, title: 'A/B Testing Framework', deliveries: 10, categories: ['Growth'] },
  { id: 28, title: 'Data Protection & GDPR', deliveries: 9, categories: ['Legal & Compliance'] },
  { id: 29, title: 'Database Architecture', deliveries: 8, categories: ['Infrastructure'] },
  { id: 30, title: 'Partnership Development', deliveries: 7, categories: ['Growth'] },

  // Medium Demand Services (15-19 delivered)
  { id: 31, title: 'Investor Call Coaching (ex-YC Founder)', deliveries: 19, categories: ['Fundraising'] },
  { id: 32, title: 'Financial Modeling', deliveries: 18, categories: ['Fundraising'] },
  { id: 33, title: 'Influencer Partnership Program', deliveries: 17, categories: ['PR & Marketing'] },
  { id: 34, title: 'Customer Success Program', deliveries: 16, categories: ['Growth'] },
  { id: 35, title: 'Cap Table Optimization', deliveries: 15, categories: ['Fundraising'] },
  { id: 36, title: 'Regulatory Compliance Framework', deliveries: 14, categories: ['Legal & Compliance'] },
  { id: 37, title: 'Scalability Planning', deliveries: 13, categories: ['Infrastructure'] },
  { id: 38, title: 'Team Building & Recruitment', deliveries: 12, categories: ['Growth'] },
  { id: 39, title: 'User Research & Validation', deliveries: 11, categories: ['MVP Building'] },
  { id: 40, title: 'Security Audit & Penetration Testing', deliveries: 10, categories: ['Infrastructure'] },

  // Standard Services (10-14 delivered)
  { id: 41, title: 'Due Diligence Preparation', deliveries: 14, categories: ['Fundraising'] },
  { id: 42, title: 'Feature Prioritization', deliveries: 13, categories: ['MVP Building'] },
  { id: 43, title: 'Market Expansion Strategy', deliveries: 12, categories: ['Growth'] },
  { id: 44, title: 'Technical Due Diligence', deliveries: 11, categories: ['Infrastructure'] },
  { id: 45, title: 'Intellectual Property Protection', deliveries: 10, categories: ['Legal & Compliance'] },
  { id: 46, title: 'International Expansion Legal', deliveries: 9, categories: ['Legal & Compliance'] },
  { id: 47, title: 'Term Sheet Negotiation', deliveries: 8, categories: ['Fundraising'] },
  { id: 48, title: 'Crisis Management Strategy', deliveries: 7, categories: ['PR & Marketing'] },
  { id: 49, title: 'Exit Strategy Planning', deliveries: 6, categories: ['Fundraising'] },

  // Additional Services (50-79)
  { id: 50, title: 'Blockchain Development Services', deliveries: 15, categories: ['Infrastructure'] },
  { id: 51, title: 'DeFi Protocol Development', deliveries: 14, categories: ['Infrastructure'] },
  { id: 52, title: 'NFT Marketplace Development', deliveries: 13, categories: ['Infrastructure'] },
  { id: 53, title: 'Smart Contract Development', deliveries: 12, categories: ['Infrastructure'] },
  { id: 54, title: 'Web3 Wallet Integration', deliveries: 11, categories: ['Infrastructure'] },
  { id: 55, title: 'Cross-Chain Bridge Development', deliveries: 10, categories: ['Infrastructure'] },
  { id: 56, title: 'DAO Governance Setup', deliveries: 9, categories: ['Infrastructure'] },
  { id: 57, title: 'Token Launch Strategy', deliveries: 8, categories: ['Fundraising'] },
  { id: 58, title: 'ICO/IDO Marketing Campaign', deliveries: 7, categories: ['PR & Marketing'] },
  { id: 59, title: 'Community Management', deliveries: 6, categories: ['Growth'] },
  { id: 60, title: 'Discord Server Setup', deliveries: 5, categories: ['Growth'] },

  // Services 61-80
  { id: 61, title: 'Telegram Bot Development', deliveries: 4, categories: ['Infrastructure'] },
  { id: 62, title: 'Discord Bot Development', deliveries: 3, categories: ['Infrastructure'] },
  { id: 63, title: 'Twitter Bot Development', deliveries: 2, categories: ['Infrastructure'] },
  { id: 64, title: 'Reddit Bot Development', deliveries: 1, categories: ['Infrastructure'] },
  { id: 65, title: 'Telegram Channel Management', deliveries: 5, categories: ['Growth'] },
  { id: 66, title: 'Twitter Account Management', deliveries: 4, categories: ['Growth'] },
  { id: 67, title: 'Reddit Community Management', deliveries: 3, categories: ['Growth'] },
  { id: 68, title: 'YouTube Channel Management', deliveries: 2, categories: ['Growth'] },
  { id: 69, title: 'TikTok Account Management', deliveries: 1, categories: ['Growth'] },
  { id: 70, title: 'LinkedIn Account Management', deliveries: 5, categories: ['Growth'] },

  // Services 71-90
  { id: 71, title: 'Facebook Page Management', deliveries: 4, categories: ['Growth'] },
  { id: 72, title: 'Instagram Account Management', deliveries: 3, categories: ['Growth'] },
  { id: 73, title: 'Snapchat Account Management', deliveries: 2, categories: ['Growth'] },
  { id: 74, title: 'Pinterest Account Management', deliveries: 1, categories: ['Growth'] },
  { id: 75, title: 'Quora Account Management', deliveries: 5, categories: ['Growth'] },
  { id: 76, title: 'Medium Blog Management', deliveries: 4, categories: ['Growth'] },
  { id: 77, title: 'Substack Newsletter Management', deliveries: 3, categories: ['Growth'] },
  { id: 78, title: 'Podcast Management', deliveries: 2, categories: ['Growth'] },
  { id: 79, title: 'Video Production', deliveries: 1, categories: ['PR & Marketing'] },
  { id: 80, title: 'Graphic Design Services', deliveries: 5, categories: ['PR & Marketing'] },

  // Services 81-100
  { id: 81, title: 'Logo Design', deliveries: 4, categories: ['PR & Marketing'] },
  { id: 82, title: 'Website Design', deliveries: 3, categories: ['PR & Marketing'] },
  { id: 83, title: 'Mobile App Design', deliveries: 2, categories: ['PR & Marketing'] },
  { id: 84, title: 'UI/UX Design', deliveries: 1, categories: ['PR & Marketing'] },
  { id: 85, title: 'Brand Guidelines', deliveries: 5, categories: ['PR & Marketing'] },
  { id: 86, title: 'Marketing Materials Design', deliveries: 4, categories: ['PR & Marketing'] },
  { id: 87, title: 'Presentation Design', deliveries: 3, categories: ['PR & Marketing'] },
  { id: 88, title: 'Infographic Design', deliveries: 2, categories: ['PR & Marketing'] },
  { id: 89, title: 'Brochure Design', deliveries: 1, categories: ['PR & Marketing'] },
  { id: 90, title: 'Business Card Design', deliveries: 5, categories: ['PR & Marketing'] },

  // Services 91-110
  { id: 91, title: 'Email Marketing Setup', deliveries: 4, categories: ['Growth'] },
  { id: 92, title: 'SMS Marketing Setup', deliveries: 3, categories: ['Growth'] },
  { id: 93, title: 'Push Notification Setup', deliveries: 2, categories: ['Growth'] },
  { id: 94, title: 'In-App Messaging Setup', deliveries: 1, categories: ['Growth'] },
  { id: 95, title: 'Chatbot Development', deliveries: 5, categories: ['Infrastructure'] },
  { id: 96, title: 'Live Chat Integration', deliveries: 4, categories: ['Infrastructure'] },
  { id: 97, title: 'Customer Support System', deliveries: 3, categories: ['Infrastructure'] },
  { id: 98, title: 'Help Desk Setup', deliveries: 2, categories: ['Infrastructure'] },
  { id: 99, title: 'Knowledge Base Setup', deliveries: 1, categories: ['Infrastructure'] },
  { id: 100, title: 'FAQ System Setup', deliveries: 5, categories: ['Infrastructure'] },

  // Services 101-120
  { id: 101, title: 'Analytics Dashboard Setup', deliveries: 4, categories: ['Infrastructure'] },
  { id: 102, title: 'Reporting System Setup', deliveries: 3, categories: ['Infrastructure'] },
  { id: 103, title: 'Data Visualization Setup', deliveries: 2, categories: ['Infrastructure'] },
  { id: 104, title: 'Business Intelligence Setup', deliveries: 1, categories: ['Infrastructure'] },
  { id: 105, title: 'CRM Integration', deliveries: 5, categories: ['Infrastructure'] },
  { id: 106, title: 'ERP Integration', deliveries: 4, categories: ['Infrastructure'] },
  { id: 107, title: 'Payment Gateway Integration', deliveries: 3, categories: ['Infrastructure'] },
  { id: 108, title: 'Shipping Integration', deliveries: 2, categories: ['Infrastructure'] },
  { id: 109, title: 'Inventory Management Setup', deliveries: 1, categories: ['Infrastructure'] },
  { id: 110, title: 'Order Management Setup', deliveries: 5, categories: ['Infrastructure'] },

  // Services 121-128
  { id: 111, title: 'Customer Portal Development', deliveries: 4, categories: ['Infrastructure'] },
  { id: 112, title: 'Admin Panel Development', deliveries: 3, categories: ['Infrastructure'] },
  { id: 113, title: 'API Documentation', deliveries: 2, categories: ['Infrastructure'] },
  { id: 114, title: 'SDK Development', deliveries: 1, categories: ['Infrastructure'] },
  { id: 115, title: 'Plugin Development', deliveries: 5, categories: ['Infrastructure'] },
  { id: 116, title: 'Extension Development', deliveries: 4, categories: ['Infrastructure'] },
  { id: 117, title: 'Mobile App Development', deliveries: 3, categories: ['Infrastructure'] },
  { id: 118, title: 'Web App Development', deliveries: 2, categories: ['Infrastructure'] },
  { id: 119, title: 'Desktop App Development', deliveries: 1, categories: ['Infrastructure'] },
  { id: 120, title: 'Game Development', deliveries: 5, categories: ['Infrastructure'] },
  { id: 121, title: 'VR/AR Development', deliveries: 4, categories: ['Infrastructure'] },
  { id: 122, title: 'IoT Development', deliveries: 3, categories: ['Infrastructure'] },
  { id: 123, title: 'AI/ML Integration', deliveries: 2, categories: ['Infrastructure'] },
  { id: 124, title: 'Blockchain Integration', deliveries: 1, categories: ['Infrastructure'] },
  { id: 125, title: 'Cloud Migration', deliveries: 5, categories: ['Infrastructure'] },
  { id: 126, title: 'Data Migration', deliveries: 4, categories: ['Infrastructure'] },
  { id: 127, title: 'System Integration', deliveries: 3, categories: ['Infrastructure'] },
  { id: 128, title: 'Legacy System Modernization', deliveries: 2, categories: ['Infrastructure'] }
];
