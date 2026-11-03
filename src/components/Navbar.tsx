import React from 'react';
import { ShieldCheck, Moon, Sun, Briefcase, Calendar, PlusCircle, Heart } from 'lucide-react';

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
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single text element wordmark */}
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

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
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

          {/* Zone 3: 1 primary action cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Provider Switch or Action */}
            <button
              onClick={() => setIsProviderMode(!isProviderMode)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                isProviderMode
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{isProviderMode ? 'Provider Mode: Active' : 'Switch to Provider Mode'}</span>
            </button>

            {/* Post Civic RFQ or Service Listing */}
            <button
              onClick={openNewProjectModal}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isProviderMode ? 'List New Service' : 'Post Community Tender'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav strip */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800 text-xs overflow-x-auto gap-3">
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
        </div>
      </div>
    </header>
  );
};
