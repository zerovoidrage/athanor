'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { NavArrowDownSolid, Plus, ArrowRight } from 'iconoir-react';
import { motion } from 'framer-motion';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';
import UserDropdown, { UserDropdownItem } from '@/components/ui/UserDropdown';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useDropdown } from '@/contexts/DropdownContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import UserDisplayName from '@/components/ui/UserDisplayName';
import NameModal from '@/components/modals/NameModal';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isConnectDropdownOpen, setIsConnectDropdownOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<'founder' | 'investor' | 'advisor' | null>(null);
  const { selectedCategory, setSelectedCategory } = useMarketplace();
  const { setIsAnyDropdownOpen } = useDropdown();

  // Проверяем, открыт ли любой dropdown
  const isAnyDropdownOpen = isDropdownOpen || isNavDropdownOpen || isCategoryDropdownOpen || isConnectDropdownOpen;
  const router = useRouter();
  const pathname = usePathname();

  // Обновляем состояние в контексте при изменении dropdown'ов
  useEffect(() => {
    setIsAnyDropdownOpen(isAnyDropdownOpen);
  }, [isAnyDropdownOpen, setIsAnyDropdownOpen]);

  // Закрытие дропдаунов при клике вне их
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Проверяем, что клик не на триггере дропдауна и не внутри дропдауна
      if (!target.closest('[data-dropdown-trigger]') && !target.closest('[data-dropdown]')) {
        setIsDropdownOpen(false);
        setIsNavDropdownOpen(false);
        setIsCategoryDropdownOpen(false);
        setIsConnectDropdownOpen(false);
      }
    };

    if (isAnyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAnyDropdownOpen]);

  const handleLogoClick = () => {
    try {
      router.push('/');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation
      window.location.href = '/';
    }
  };

  const handleDropdownItemClick = (path: string) => {
    setIsDropdownOpen(false);
    try {
      router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback navigation
      window.location.href = path;
    }
  };

  const handleNavDropdownItemClick = (path: string) => {
    setIsNavDropdownOpen(false);
    try {
      router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  const { isAuthenticated, logout, userRole, login, setDisplayName, displayName, isLoading } = useAuth();

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    router.push('/');
  };

  const handleRoleSelect = (role: 'founder' | 'investor' | 'advisor') => {
    setIsConnectDropdownOpen(false);
    setPendingRole(role);
    setIsNameModalOpen(true);
  };

  const handleNameComplete = (name: string) => {
    if (pendingRole) {
      login(pendingRole);
      setDisplayName(name);
      setIsNameModalOpen(false);
      setPendingRole(null);
      
      // Перенаправляем в зависимости от роли
      switch (pendingRole) {
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
    }
  };

  const handleNameModalClose = () => {
    setIsNameModalOpen(false);
    setPendingRole(null);
  };

  // Получаем аватар в зависимости от роли
  const getUserAvatar = () => {
    switch (userRole) {
      case 'investor':
        return '/avatar2.jpg';
      case 'advisor':
        return '/avatar3.jpg';
      default:
        return '/avatar.png'; // founder или по умолчанию
    }
  };

  // Получаем название страницы
  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'abyss';
      case '/launchpad':
        return 'launchpad';
      case '/founder':
        return 'launchpad';
      case '/founder/wallet':
        return 'wallet';
      case '/founder/referral':
        return 'referral';
      case '/founder/profile':
        return displayName || 'profile';
      case '/investor/profile':
        return displayName || 'profile';
      case '/advisor/profile':
        return displayName || 'profile';
      case '/profile':
        return displayName || 'profile';
      case '/marketplace':
        return 'marketplace';
      case '/wallet':
        return 'wallet';
      case '/referral':
        return 'referral';
      case '/connect':
        return 'connect';
      case '/investor/dashboard':
        return 'vault';
      case '/advisor/services':
        return 'advisor services';
      default:
        return 'abyss';
    }
  };

  // Проверяем, нужно ли показывать навигационный дропдаун
  const shouldShowNavDropdown = () => {
    return pathname === '/' || pathname === '/marketplace';
  };

  // Рендерим dropdown в зависимости от роли пользователя
  const renderUserDropdown = () => {
    if (userRole === 'founder') {
      return (
        <>
          {/* Имя пользователя */}
          <UserDisplayName displayName={displayName} />
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/founder')}>
            Launchpad
          </UserDropdownItem>
          <UserDropdownItem onClick={() => handleDropdownItemClick('/founder/wallet')}>
            Wallet
          </UserDropdownItem>
          <UserDropdownItem onClick={() => handleDropdownItemClick('/founder/referral')}>
            Referral
          </UserDropdownItem>
          
          {/* Разделитель */}
          <div className="border-t border-gray-700"></div>
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/founder/profile')}>
            Profile
          </UserDropdownItem>
          <UserDropdownItem onClick={() => handleLogout()}>
            Logout
          </UserDropdownItem>
          
          {/* Кнопка Submit your Startup - внизу dropdown */}
          <div className="mt-8">
            <PrimaryButton
              onClick={() => {
                console.log('Create button clicked');
              }}
              className="w-full justify-center"
              variant="with-icon"
            >
              <span>Submit your Startup</span>
              <ArrowRight className="w-4 h-4" />
            </PrimaryButton>
          </div>
        </>
      );
    } else if (userRole === 'investor') {
      return (
        <>
          {/* Имя пользователя */}
          <UserDisplayName displayName={displayName} />
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/investor/dashboard')}>
            Vault
          </UserDropdownItem>
          
          {/* Разделитель */}
          <div className="border-t border-gray-700"></div>
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/investor/profile')}>
            Profile
          </UserDropdownItem>
          <UserDropdownItem onClick={() => handleLogout()}>
            Logout
          </UserDropdownItem>
        </>
      );
    } else if (userRole === 'advisor') {
      return (
        <>
          {/* Имя пользователя */}
          <UserDisplayName displayName={displayName} />
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/advisor/services')}>
            Services
          </UserDropdownItem>
          
          {/* Разделитель */}
          <div className="border-t border-gray-700"></div>
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/advisor/profile')}>
            Profile
          </UserDropdownItem>
          <UserDropdownItem onClick={() => handleLogout()}>
            Logout
          </UserDropdownItem>
        </>
      );
    }
    return null;
  };



  return (
    <>
      {/* Оверлей для затемнения и блюра */}
      <div 
        className={`fixed inset-0 bg-black backdrop-blur-sm z-40 transition-all duration-200 ease-out will-change-opacity ${
          isAnyDropdownOpen 
            ? 'bg-opacity-80 opacity-100' 
            : 'bg-opacity-0 opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          setIsDropdownOpen(false);
          setIsNavDropdownOpen(false);
          setIsCategoryDropdownOpen(false);
          setIsConnectDropdownOpen(false);
        }}
      />
      
      <header 
        className="fixed top-0 left-0 right-0 text-white w-full p-4 z-50 bg-transparent select-none" 
        style={{ padding: '16px 16px', backgroundColor: 'transparent' }}
      >
                <div className="flex justify-between items-start">
          {/* Логотип и название раздела */}
          <div className="flex items-start gap-4">
          <div 
            className="cursor-pointer select-none"
            onClick={handleLogoClick}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector('span')!.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector('span')!.style.color = '#B3B3B3'; // gray-400
            }}
          >
            <span className="text-subheading transition-colors duration-200 flex items-center gap-4 select-none" style={{ color: '#B3B3B3' }}>
              athanor
              <span>/</span>
            </span>
          </div>
          
          {/* Название страницы справа от логотипа */}
          <div className="relative header-section-title">
            {shouldShowNavDropdown() ? (
              <div className="relative">
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:text-gray-400 transition-colors select-none"
                  data-dropdown-trigger
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isNavDropdownOpen) {
                      setIsNavDropdownOpen(false);
                    } else {
                      setIsNavDropdownOpen(true);
                    }
                  }}
                >
                  <span className="text-subheading select-none">
                    {getPageTitle()}
                  </span>
                  <NavArrowDownSolid 
                    className={`w-4 h-4 transition-transform ${isNavDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                {/* Навигационный dropdown меню */}
                <Dropdown 
                  isOpen={isNavDropdownOpen} 
                  onClose={() => {}}
                  position="left"
                >
                  <DropdownItem onClick={() => handleNavDropdownItemClick('/')}>
                    abyss
                  </DropdownItem>
                  <DropdownItem onClick={() => {
                    setIsNavDropdownOpen(false);
                    window.location.href = '/marketplace';
                  }}>
                    marketplace
                  </DropdownItem>
                </Dropdown>
              </div>
            ) : (
              <div className="flex items-start">
                <span className="text-subheading">
                  {getPageTitle()}
                </span>
              </div>
            )}
          </div>

                  {/* Категории для Marketplace */}
        {pathname === '/marketplace' && (
          <div className="relative header-categories">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:text-gray-400 transition-colors select-none"
                data-dropdown-trigger
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isCategoryDropdownOpen) {
                    setIsCategoryDropdownOpen(false);
                  } else {
                    setIsCategoryDropdownOpen(true);
                  }
                }}
              >
                <span className="text-subheading select-none">
                  {selectedCategory}
                </span>
                <NavArrowDownSolid 
                  className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Dropdown категорий */}
              <Dropdown 
                isOpen={isCategoryDropdownOpen} 
                onClose={() => {}}
                position="left"
              >
                <DropdownItem onClick={() => handleCategoryChange('all')}>
                  all
                </DropdownItem>
                <DropdownItem onClick={() => handleCategoryChange('fundraising')}>
                  fundraising
                </DropdownItem>
                <DropdownItem onClick={() => handleCategoryChange('pr & marketing')}>
                  pr & marketing
                </DropdownItem>
                <DropdownItem onClick={() => handleCategoryChange('mvp building')}>
                  mvp building
                </DropdownItem>
                <DropdownItem onClick={() => handleCategoryChange('legal & compliance')}>
                  legal & compliance
                </DropdownItem>
                <DropdownItem onClick={() => handleCategoryChange('infrastructure')}>
                  infrastructure
                </DropdownItem>
                <DropdownItem onClick={() => handleCategoryChange('growth')}>
                  growth
                </DropdownItem>
              </Dropdown>
            </div>
          )}
        </div>



        {/* Кнопка Connect или аватар */}
        <div className="flex items-center gap-3" suppressHydrationWarning>
          {isLoading ? (
            /* Показываем ничего во время загрузки */
            <div className="w-8 h-8"></div>
          ) : isAuthenticated ? (
            /* Аватар с dropdown */
            <div className="relative">
              <div 
                className={`rounded-full cursor-pointer hover:opacity-80 transition-all duration-200 overflow-hidden ${
                  isDropdownOpen ? 'w-10 h-10' : 'w-8 h-8'
                }`}
                data-dropdown-trigger
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isDropdownOpen) {
                    setIsDropdownOpen(false);
                  } else {
                    setIsDropdownOpen(true);
                  }
                }}
              >
                <Image
                  src={getUserAvatar()}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dropdown меню */}
              <UserDropdown 
                isOpen={isDropdownOpen} 
                onClose={() => {}}
              >
                {renderUserDropdown()}
              </UserDropdown>
            </div>
          ) : (
            /* Кнопка Connect с dropdown для неаутентифицированных пользователей */
            <div className="relative">
              <div data-dropdown-trigger>
                <SecondaryButton
                  onClick={(e) => {
                    if (e) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                    if (isConnectDropdownOpen) {
                      setIsConnectDropdownOpen(false);
                    } else {
                      setIsConnectDropdownOpen(true);
                    }
                  }}
                  variant="without-icon"
                >
                  Connect
                </SecondaryButton>
              </div>

              {/* Dropdown для выбора роли */}
              <UserDropdown 
                isOpen={isConnectDropdownOpen} 
                onClose={() => {}}
              >
                <UserDropdownItem onClick={() => handleRoleSelect('founder')}>
                  Founder
                </UserDropdownItem>
                <UserDropdownItem onClick={() => handleRoleSelect('investor')}>
                  Investor
                </UserDropdownItem>
                <UserDropdownItem onClick={() => handleRoleSelect('advisor')}>
                  Advisor
                </UserDropdownItem>
              </UserDropdown>
            </div>
          )}
        </div>
              </div>
      </header>

      {/* Модалка для ввода имени */}
      <NameModal
        isOpen={isNameModalOpen}
        onClose={handleNameModalClose}
        onComplete={handleNameComplete}
      />
    </>
  );
} 