import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Moon, 
  Sun, 
  Briefcase, 
  Calendar, 
  PlusCircle, 
  Heart, 
  User, 
  LogOut, 
  ChevronDown, 
  UserCheck, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Award 
} from 'lucide-react';
import { UserAccount } from '../types.ts';

interface NavbarProps {
  currentTab: 'browse' | 'saved' | 'civic' | 'how_it_works' | 'my_bookings';
  setCurrentTab: (tab: 'browse' | 'saved' | 'civic' | 'how_it_works' | 'my_bookings') => void;
  isProviderMode: boolean;
  setIsProviderMode: (mode: boolean) => void;
  openNewProjectModal: () => void;
  bookingCount: number;
  savedCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  // Auth props
  currentUser: UserAccount | null;
  onOpenAuthModal: (mode: 'signin' | 'signup') => void;
  onLogout: () => void;
  onSwitchUser: (user: UserAccount) => void;
  allUsers: UserAccount[];
  openProviderDashboard: (providerId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isProviderMode,
  setIsProviderMode,
  openNewProjectModal,
  bookingCount,
  savedCount,
  darkMode,
  setDarkMode,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onSwitchUser,
  allUsers,
  openProviderDashboard,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isTrader = currentUser?.role === 'provider';
  const isCivic = currentUser?.role === 'civic_official';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-18">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('browse')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 shadow-sm transition-transform group-hover:scale-105">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
                CivicGuild
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('browse')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                currentTab === 'browse'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Discover Services
            </button>
            <button
              onClick={() => setCurrentTab('saved')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                currentTab === 'saved'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${savedCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-medium">
                  ({savedCount})
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentTab('civic')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                currentTab === 'civic'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Civic & Municipal Tenders
            </button>
            <button
              onClick={() => setCurrentTab('how_it_works')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                currentTab === 'how_it_works'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              How Escrow Works
            </button>
            <button
              onClick={() => setCurrentTab('my_bookings')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                currentTab === 'my_bookings'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>My Appointments</span>
                {bookingCount > 0 && (
                  <span className="ml-1 text-xs font-mono font-medium text-indigo-600 dark:text-indigo-300">
                    ({bookingCount})
                  </span>
                )}
              </span>
            </button>
          </nav>

          {/* Zone 3: Actions Cluster & Auth */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Theme toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Provider Console Access */}
            <button
              onClick={() => {
                if (isTrader && currentUser?.providerId) {
                  openProviderDashboard(currentUser.providerId);
                } else {
                  setIsProviderMode(!isProviderMode);
                }
              }}
              className={`hidden sm:flex px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap items-center gap-1.5 ${
                isProviderMode || isTrader
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isTrader ? 'Trader Console' : isProviderMode ? 'Provider: Active' : 'Trader Mode'}</span>
            </button>

            {/* Post Community Tender */}
            <button
              onClick={openNewProjectModal}
              className="hidden md:flex px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-colors whitespace-nowrap items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isCivic ? 'Post Municipal RFQ' : isTrader ? 'Add Service' : 'Post Tender'}</span>
            </button>

            {/* Authentication Control */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-800 transition-all text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${
                      isTrader ? 'bg-emerald-500' : isCivic ? 'bg-amber-500' : 'bg-indigo-500'
                    }`} />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[110px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 capitalize">
                      {isTrader ? 'Trader' : isCivic ? 'Civic Official' : 'Client'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {currentUser.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {currentUser.email}
                          </p>
                          <span className={`inline-block text-[10px] font-mono px-1.5 py-0.2 rounded mt-1 ${
                            isTrader 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                              : isCivic 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}>
                            {isTrader ? `Trader • ${currentUser.businessName || 'Pro'}` : isCivic ? `Civic • ${currentUser.agencyDepartment || 'Gov'}` : 'Verified Client'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Role specific quick action */}
                    <div className="px-2 py-2 border-b border-slate-100 dark:border-slate-800 space-y-1">
                      {isTrader ? (
                        <>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              if (currentUser.providerId) {
                                openProviderDashboard(currentUser.providerId);
                              } else {
                                setIsProviderMode(true);
                              }
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between"
                          >
                            <span className="flex items-center gap-2">
                              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                              <span>My Trader Dashboard & Trends</span>
                            </span>
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Live</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              setCurrentTab('civic');
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                          >
                            <Award className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Bid on Municipal Tenders</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              setCurrentTab('my_bookings');
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between"
                          >
                            <span className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                              <span>My Bookings & Escrow Holds</span>
                            </span>
                            {bookingCount > 0 && (
                              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">({bookingCount})</span>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              setCurrentTab('saved');
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-between"
                          >
                            <span className="flex items-center gap-2">
                              <Heart className="w-3.5 h-3.5 text-rose-500" />
                              <span>Saved Providers</span>
                            </span>
                            {savedCount > 0 && (
                              <span className="text-[10px] font-mono text-rose-600">({savedCount})</span>
                            )}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Switch persona shortcut */}
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Quick Switch Persona
                      </p>
                      <div className="space-y-1">
                        {allUsers.filter(u => u.id !== currentUser.id).slice(0, 3).map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              onSwitchUser(u);
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-2 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-2"
                          >
                            <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                            <span className="truncate">{u.name} ({u.role === 'provider' ? 'Trader' : u.role === 'civic_official' ? 'Gov' : 'Client'})</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sign out */}
                    <div className="px-2 pt-1.5">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('signin')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('signup')}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800 text-xs overflow-x-auto gap-3">
          <button
            onClick={() => setCurrentTab('browse')}
            className={`py-1 whitespace-nowrap ${currentTab === 'browse' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Services
          </button>
          <button
            onClick={() => setCurrentTab('saved')}
            className={`py-1 whitespace-nowrap flex items-center gap-1 ${currentTab === 'saved' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Heart className={`w-3 h-3 ${savedCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Saved ({savedCount})</span>
          </button>
          <button
            onClick={() => setCurrentTab('civic')}
            className={`py-1 whitespace-nowrap ${currentTab === 'civic' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Civic
          </button>
          <button
            onClick={() => setCurrentTab('how_it_works')}
            className={`py-1 whitespace-nowrap ${currentTab === 'how_it_works' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Trust
          </button>
          <button
            onClick={() => setCurrentTab('my_bookings')}
            className={`py-1 whitespace-nowrap ${currentTab === 'my_bookings' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Bookings ({bookingCount})
          </button>
          <button
            onClick={() => {
              if (currentUser) {
                if (isTrader && currentUser.providerId) {
                  openProviderDashboard(currentUser.providerId);
                } else {
                  setIsProviderMode(!isProviderMode);
                }
              } else {
                onOpenAuthModal('signin');
              }
            }}
            className="py-1 text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap flex items-center gap-1"
          >
            <Briefcase className="w-3 h-3" />
            <span>{isTrader ? 'Trader Console' : 'Trader Mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
