'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { NavArrowDownSolid, Plus, ArrowRight } from 'iconoir-react';
import { motion } from 'framer-motion';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';
import UserDropdown, { UserDropdownItem } from '@/components/ui/UserDropdown';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAbyss } from '@/contexts/AbyssContext';
import { useDropdown } from '@/contexts/DropdownContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOverlay } from '@/contexts/OverlayContext';

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
  const [pendingRole, setPendingRole] = useState<'founder' | 'investor' | 'advisor' | 'clean-investor' | null>(null);
  const { selectedCategory: marketplaceCategory, setSelectedCategory: setMarketplaceCategory } = useMarketplace();
  const { selectedCategory: abyssCategory, setSelectedCategory: setAbyssCategory } = useAbyss();
  const { setIsAnyDropdownOpen } = useDropdown();
  const { isOverlayOpen } = useOverlay();

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
    if (pathname === '/marketplace') {
      setMarketplaceCategory(category);
    } else if (pathname === '/') {
      setAbyssCategory(category);
    }
    setIsCategoryDropdownOpen(false);
  };

  const { isAuthenticated, logout, userRole, login, setDisplayName, displayName, isLoading } = useAuth();

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    router.push('/');
  };

  const handleRoleSelect = (role: 'founder' | 'investor' | 'advisor' | 'clean-investor') => {
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
          router.push('/vault');
          break;
        case 'clean-investor':
          router.push('/clean');
          break;
        case 'advisor':
          router.push('/services');
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
      case 'clean-investor':
        return '/avatar2.jpg'; // используем тот же аватар что и для investor
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
      case '/vault':
        return 'vault';
      case '/clean':
        return 'vault';
      case '/services':
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
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/launchpad')}>
            Launchpad
          </UserDropdownItem>
          <UserDropdownItem onClick={() => handleDropdownItemClick('/wallet')}>
            Wallet
          </UserDropdownItem>
          <UserDropdownItem onClick={() => handleDropdownItemClick('/referral')}>
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
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/vault')}>
            Vault
          </UserDropdownItem>
          
          {/* Разделитель */}
          <div className="border-t border-gray-700"></div>
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/profile')}>
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
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/services')}>
            Services
          </UserDropdownItem>
          
          {/* Разделитель */}
          <div className="border-t border-gray-700"></div>
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/profile')}>
            Profile
          </UserDropdownItem>
          <UserDropdownItem onClick={() => handleLogout()}>
            Logout
          </UserDropdownItem>
        </>
      );
    } else if (userRole === 'clean-investor') {
      return (
        <>
          {/* Имя пользователя */}
          <UserDisplayName displayName={displayName} />
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/clean')}>
            Vault
          </UserDropdownItem>
          
          {/* Разделитель */}
          <div className="border-t border-gray-700"></div>
          
          <UserDropdownItem onClick={() => handleDropdownItemClick('/profile')}>
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
          (isAnyDropdownOpen || isOverlayOpen)
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
        id="header"
        className="fixed top-0 left-0 right-0 text-white w-full p-4 z-50 select-none" 
        style={{ 
          padding: '16px 16px',
          backgroundColor: isOverlayOpen ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
          filter: isOverlayOpen ? 'blur(6px)' : 'none',
          transition: 'filter 200ms ease, background-color 200ms ease'
        }}
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
            
            {/* Название страницы и категории в одном контейнере */}
            <div className="flex items-start gap-4">
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
                      
                      {/* Дополнительные пункты */}
                      <div className="mt-8">
                        <DropdownItem 
                          onClick={() => {
                            setIsNavDropdownOpen(false);
                          }}
                          className="text-white-700 hover:text-white-900 hover:bg-onsurface-800"
                        >
                          explore athanor
                        </DropdownItem>
                        <DropdownItem 
                          onClick={() => {
                            setIsNavDropdownOpen(false);
                            window.location.href = '/knowledge-base';
                          }}
                          className="text-white-700 hover:text-white-900 hover:bg-onsurface-800"
                        >
                          knowledge base
                        </DropdownItem>
                        <DropdownItem 
                          onClick={() => {
                            setIsNavDropdownOpen(false);
                          }}
                          className="text-white-700 hover:text-white-900 hover:bg-onsurface-800"
                        >
                          twitter
                        </DropdownItem>
                      </div>
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

              {/* Категории для Marketplace и Abyss */}
              {(pathname === '/marketplace' || pathname === '/') && (
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
                      {pathname === '/marketplace' ? marketplaceCategory.toLowerCase() : abyssCategory.toLowerCase()}
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
                    {pathname === '/marketplace' ? (
                      // Категории для Marketplace
                      <>
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
                      </>
                    ) : (
                      // Категории для Abyss
                      <>
                        <DropdownItem onClick={() => handleCategoryChange('all')}>
                          all (9)
                        </DropdownItem>
                        <DropdownItem onClick={() => handleCategoryChange('AgriTech')}>
                          agritech (3)
                        </DropdownItem>
                        <DropdownItem onClick={() => handleCategoryChange('AI & ML')}>
                          ai & ml (1)
                        </DropdownItem>
                        <DropdownItem onClick={() => handleCategoryChange('Climate Tech')}>
                          climate tech (2)
                        </DropdownItem>
                        <DropdownItem onClick={() => handleCategoryChange('Cybersecurity')}>
                          cybersecurity (1)
                        </DropdownItem>
                        <DropdownItem onClick={() => handleCategoryChange('Data & Analytics')}>
                          data & analytics (1)
                        </DropdownItem>
                        <DropdownItem onClick={() => handleCategoryChange('DeFi')}>
                          defi (1)
                        </DropdownItem>
                      </>
                    )}
                  </Dropdown>
                </div>
              )}
            </div>
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
                <UserDropdownItem onClick={() => handleRoleSelect('clean-investor')}>
                  Clean Investor
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
