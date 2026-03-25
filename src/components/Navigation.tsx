'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeSlider } from './ThemeSlider';

const Navigation = () => {
  const { user, isLoading, isAuthConfigured } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const displayEmail = user?.email ?? 'Logged in user';
  const defaultAvatar = '/image.png';

  const inventoryItems = [
    { href: '/add-account', label: 'Business Units' },
    { href: '/record-balances', label: 'Inventory Balances' },
  ];

  const accountingItems = [
    { href: '/log-expenses', label: 'Record Transactions' },
    { href: '/bank-statements', label: 'Import Statements' },
  ];

  const analyticsItems = [
    { href: '/investor-dashboard', label: 'Investor Report' },
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
    <nav className="bg-white dark:bg-neutral-900 shadow-lg dark:shadow-neutral-900/50 border-b dark:border-neutral-700 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Shift N Go Logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <span className="text-xl font-bold text-brand-red hidden sm:block">Shift N Go</span>
            <span className="text-lg font-bold text-brand-red sm:hidden">Shift N Go</span>
          </div>

          {/* Desktop Navigation */}
          {(user || !isAuthConfigured) && (
            <div className="hidden md:flex space-x-1 items-center" ref={dropdownRef}>
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-bold transition-colors ${pathname === '/'
                  ? 'text-brand-red bg-red-50 dark:bg-red-900/10'
                  : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                  }`}
              >
                SUMMARY
              </Link>

              {/* Inventory Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'inventory' ? null : 'inventory')}
                  className={`px-3 py-2 rounded-md text-sm font-bold transition-colors uppercase tracking-tight flex items-center space-x-1 ${inventoryItems.some(i => i.href === pathname)
                    ? 'text-brand-red'
                    : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                    }`}
                >
                  <span>Inventory</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'inventory' && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md bg-white dark:bg-neutral-800 shadow-xl border dark:border-neutral-700 z-50">
                    {inventoryItems.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className={`block px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors ${pathname === item.href ? 'text-brand-red dark:text-brand-red bg-red-50/50 dark:bg-red-900/10' : 'text-gray-700 dark:text-neutral-300'}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Accounting Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'accounting' ? null : 'accounting')}
                  className={`px-3 py-2 rounded-md text-sm font-bold transition-colors uppercase tracking-tight flex items-center space-x-1 ${accountingItems.some(i => i.href === pathname)
                    ? 'text-brand-red'
                    : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                    }`}
                >
                  <span>Operations</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'accounting' && (
                  <div className="absolute left-0 mt-2 w-52 rounded-md bg-white dark:bg-neutral-800 shadow-xl border dark:border-neutral-700 z-50">
                    {accountingItems.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className={`block px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors ${pathname === item.href ? 'text-brand-red bg-red-50 dark:bg-red-900/10' : 'text-gray-700 dark:text-neutral-300'}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Analytics Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'analytics' ? null : 'analytics')}
                  className={`px-3 py-2 rounded-md text-sm font-bold transition-colors uppercase tracking-tight flex items-center space-x-1 ${analyticsItems.some(i => i.href === pathname)
                    ? 'text-brand-red'
                    : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                    }`}
                >
                  <span>Analytics</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'analytics' && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-neutral-800 shadow-xl border dark:border-neutral-700 z-50">
                    {analyticsItems.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className={`block px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors ${pathname === item.href ? 'text-brand-red bg-red-50 dark:bg-red-900/10' : 'text-gray-700 dark:text-neutral-300'}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile menu Actions */}
              <div className="flex items-center space-x-4 pl-4 border-l dark:border-neutral-700 ml-4">
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
                    <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 shadow-lg z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-700">
                        <p className="text-sm text-gray-500 dark:text-neutral-400">Signed in as</p>
                        <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-neutral-200">{displayEmail}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Settings
                        </Link>
                        <Link
                          href="/disclaimer"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Privacy
                        </Link>
                        <a
                          href="/auth/logout"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
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
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-neutral-800 border-t dark:border-neutral-700">
            <div className="flex items-center space-x-3 px-3 py-3 rounded-md bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600">
              <Image src={defaultAvatar} alt="Profile avatar" width={40} height={40} className="rounded-full border border-gray-200 dark:border-neutral-600" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-neutral-400">Signed in as</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">{displayEmail}</span>
              </div>
            </div>
            {/* Main Nav Items */}
            {[
              { href: '/', label: 'Balance Sheet Summary' },
              ...inventoryItems,
              ...accountingItems,
              ...analyticsItems,
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${isActive
                    ? 'bg-neutral-50 dark:bg-neutral-800 text-brand-red border border-brand-red/20'
                    : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-700'
                    }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-neutral-700">
              <Link
                href="/settings"
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                <span>Settings</span>
              </Link>
              <Link
                href="/disclaimer"
                onClick={closeMobileMenu}
                className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                <span>Privacy</span>
              </Link>
              {/* Only show logout when Auth0 is configured and user is logged in */}
              {isAuthConfigured && user && (
                <a
                  href="/auth/logout"
                  onClick={closeMobileMenu}
                  className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-700"
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



