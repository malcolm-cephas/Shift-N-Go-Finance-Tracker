'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeSlider } from './ThemeSlider';

const Navigation = () => {
  const { user, isLoading, isAuthConfigured, role } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const displayEmail = user?.email ?? 'Logged in user';
  const defaultAvatar = '/profile-placeholder.svg';

  const isAdminOrManager = role === 'ADMIN' || role === 'MANAGER';

  const inventoryItems = [
    { href: '/inventory', label: 'Vehicle Inventory' },
    { href: '/add-account', label: 'Business Vehicles' },
    { href: '/record-balances', label: 'Inventory Balances' },
  ];

  const accountingItems = [
    { href: '/log-expenses', label: 'Record Transactions' },
    { href: '/bank-statements', label: 'Import Statements' },
  ];

  const analyticsItems = [
    { href: '/investor-dashboard', label: 'Investor Report' },
    { href: '/inventory', label: 'Vehicle Portfolio' },
    { href: '/transactions', label: 'Master History' },
    { href: '/historical', label: 'Performance Charts' },
  ];

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    if (isProfileMenuOpen || activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen, activeDropdown]);

  if (isLoading) {
    return null;
  }

  return (
    <nav className="bg-[#F8F8F8] shadow-xl border-b border-gray-200 transition-colors duration-200 relative z-[100]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-1">
          {/* Logo/Brand - Banner Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Image
                src="/shiftngo-banner.png"
                alt="Shift N Go Banner"
                width={300}
                height={96}
                className="h-24 w-auto transition-all duration-300 group-hover:scale-[1.01]"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {(user || !isAuthConfigured) && (
            <div className="hidden md:flex space-x-1 items-center" ref={dropdownRef}>
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-bold transition-colors ${pathname === '/'
                  ? 'text-brand-red bg-white shadow-sm'
                  : 'text-gray-700 hover:bg-white/60 hover:text-gray-900'
                  }`}
              >
                SUMMARY
              </Link>

              {/* Inventory Dropdown - Restricted to Admin/Manager */}
              {isAdminOrManager && (
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'inventory' ? null : 'inventory')}
                    className={`px-3 py-2 rounded-md text-sm font-bold transition-colors uppercase tracking-tight flex items-center space-x-1 ${inventoryItems.some(i => i.href === pathname)
                      ? 'text-brand-red'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <span>Inventory</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'inventory' && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md bg-[#F8F8F8] shadow-2xl border border-gray-100 z-[110]">
                      {inventoryItems.map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className={`block px-4 py-3 text-sm font-medium hover:bg-white transition-colors ${pathname === item.href ? 'text-brand-red bg-white' : 'text-gray-700'}`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Accounting Dropdown - Restricted to Admin/Manager */}
              {isAdminOrManager && (
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'accounting' ? null : 'accounting')}
                    className={`px-3 py-2 rounded-md text-sm font-bold transition-colors uppercase tracking-tight flex items-center space-x-1 ${accountingItems.some(i => i.href === pathname)
                      ? 'text-brand-red'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <span>Operations</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === 'accounting' && (
                    <div className="absolute left-0 mt-2 w-52 rounded-md bg-[#F8F8F8] shadow-2xl border border-gray-100 z-[110]">
                      {accountingItems.map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className={`block px-4 py-3 text-sm font-medium hover:bg-white transition-colors ${pathname === item.href ? 'text-brand-red bg-white' : 'text-gray-700'}`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Analytics Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'analytics' ? null : 'analytics')}
                  className={`px-3 py-2 rounded-md text-sm font-bold transition-colors uppercase tracking-tight flex items-center space-x-1 ${analyticsItems.some(i => i.href === pathname)
                    ? 'text-brand-red'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span>Analytics</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'analytics' && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-[#F8F8F8] shadow-2xl border border-gray-100 z-[110]">
                    {analyticsItems.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className={`block px-4 py-3 text-sm font-medium hover:bg-white transition-colors ${pathname === item.href ? 'text-brand-red bg-white' : 'text-gray-700'}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile menu Actions */}
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 ml-4">
                <ThemeSlider />
              </div>
              {isAuthConfigured && user && (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-red"
                    aria-haspopup="true"
                    aria-expanded={isProfileMenuOpen}
                  >
                    <Image
                      src={defaultAvatar}
                      alt="Profile avatar"
                      width={36}
                      height={36}
                      className="rounded-full border border-gray-200 dark:border-neutral-600 shadow-sm"
                    />
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-[#F8F8F8] shadow-2xl z-[120]">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="mt-1 text-sm font-semibold text-gray-800">{displayEmail}</p>
                      </div>
                      <div className="py-1">
                        {isAdminOrManager && (
                          <Link
                            href="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-white transition-colors font-medium"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Settings
                          </Link>
                        )}
                        {role === 'ADMIN' && (
                          <Link
                            href="/manage-access"
                            className="block px-4 py-2 text-sm text-brand-red font-black hover:bg-white transition-colors"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Manage Access
                          </Link>
                        )}
                        <Link
                          href="/disclaimer"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-white transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Privacy
                        </Link>
                        <Link
                          href="/terms"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-white transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Terms
                        </Link>
                        <a
                          href="/auth/logout"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-white transition-colors"
                        >
                          Logout
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {!user && isAuthConfigured && (
            <div className="hidden md:flex items-center space-x-1">
              <div className="mr-6">
                <ThemeSlider />
              </div>
              <a
                href="/auth/login?screen_hint=signup"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-800 dark:hover:text-neutral-200"
              >
                <span>Login</span>
              </a>
            </div>
          )}

          {/* Mobile Menu Button - shown when user logged in OR in offline mode */}
          {(user || !isAuthConfigured) && (
            <div className="md:hidden flex items-center space-x-1">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-red"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-[#F8F8F8] border-t border-gray-200">
            <div className="flex items-center space-x-3 px-3 py-3 rounded-md bg-white border border-gray-200">
              <Image src={defaultAvatar} alt="Profile avatar" width={40} height={40} className="rounded-full border border-gray-200" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Signed in as</span>
                <span className="text-sm font-semibold text-gray-800">{displayEmail}</span>
              </div>
            </div>
            {/* Main Nav Items */}
            {[
              { href: '/', label: 'Balance Sheet Summary' },
              ...(isAdminOrManager ? inventoryItems : []),
              ...(isAdminOrManager ? accountingItems : []),
              ...analyticsItems,
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${isActive
                    ? 'bg-white text-brand-red border border-gray-200 shadow-sm'
                    : 'text-gray-600 hover:bg-white/60'
                    }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              {isAdminOrManager && (
                <Link
                  href="/settings"
                  onClick={closeMobileMenu}
                  className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-white/60"
                >
                  <span>Settings</span>
                </Link>
              )}
              <Link
                href="/disclaimer"
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-white/60"
              >
                <span>Privacy</span>
              </Link>
              <Link
                href="/terms"
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-white/60"
              >
                <span>Terms</span>
              </Link>
              {/* Only show logout when Auth0 is configured and user is logged in */}
              {isAuthConfigured && user && (
                <a
                  href="/auth/logout"
                  onClick={closeMobileMenu}
                  className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-white/60"
                >
                  <span>Logout</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;



