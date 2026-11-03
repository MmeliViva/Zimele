import React from 'react';
import { Search, MapPin, Calendar, ShieldCheck, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { ServiceCategoryId, UserAccount } from '../types.ts';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ServiceCategoryId;
  setSelectedCategory: (cat: ServiceCategoryId) => void;
  selectedNeighborhood: string;
  setSelectedNeighborhood: (n: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (f: string) => void;
  onExploreCivic: () => void;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: (mode: 'signin' | 'signup') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedNeighborhood,
  setSelectedNeighborhood,
  availabilityFilter,
  setAvailabilityFilter,
  onExploreCivic,
  currentUser,
  onOpenAuthModal,
}) => {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline and Search */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Clean unboxed kicker with separator */}
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase mb-3">
              <span>Verified Municipal & Residential Network</span>
              <span aria-hidden="true">·</span>
              <span>100% Escrow Secured</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight [text-wrap:balance]">
              Book trusted local craftsmen, stylists & community specialists.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              From precision electricians and licensed plumbers to studio beauty artists and neighborhood civic infrastructure contractors—discover verified professionals with real-time slots.
            </p>

            {/* Interactive Search & Filter Bar */}
            <div className="mt-8 p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Search Term */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g. Electrician, Nails, Gutter..."
                    className="w-full text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                {/* Neighborhood Dropdown */}
                <div className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="all">All Neighborhoods</option>
                    <option value="Old Town & East Ward">Old Town & East Ward</option>
                    <option value="Oak Street Arts District">Oak Street Arts District</option>
                    <option value="North Riverfront">North Riverfront</option>
                    <option value="Westside Foothills">Westside Foothills</option>
                    <option value="Historic District">Historic District</option>
                    <option value="North Ridge">North Ridge</option>
                    <option value="Central Commons">Central Commons</option>
                  </select>
                </div>

                {/* Real-time Availability Filter */}
                <div className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="any">Any Availability</option>
                    <option value="today">Available Today</option>
                    <option value="tomorrow">Available Tomorrow</option>
                    <option value="week">This Week</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Status / Persona Shortcut Bar */}
            {currentUser ? (
              <div className="mt-4 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    Logged in as <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong>
                    <span className="text-slate-400 dark:text-slate-500 ml-1">
                      ({currentUser.role === 'provider' ? `Trader • ${currentUser.businessName || 'Pro'}` : currentUser.role === 'civic_official' ? 'Civic Official' : 'Client'})
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenAuthModal?.('signin')}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium ml-2 text-[11px]"
                >
                  Switch User
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-slate-500">Join CivicGuild:</span>
                <button
                  type="button"
                  onClick={() => onOpenAuthModal?.('signup')}
                  className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Become a Verified Trader</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => onOpenAuthModal?.('signup')}
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Client Sign Up</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Adjacent Trust & Quantitative Proof */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  100%
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Escrow payment bonded
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  4.95 / 5
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Over 2,400 verified reviews
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  $2.4M+
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Local neighborhood civic bids
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Anchor with Verified Badge Callout */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[460px] shadow-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <img
                src="/src/assets/images/hero_craftsman_pro_1793666363900.jpg"
                alt="Master electrician on site checking modern electrical panels"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {/* Bottom Scrim Callout */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-white flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium">
                    <Award className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">City Vetted Master Trade</span>
                  </div>
                  <p className="text-sm font-semibold truncate text-white mt-0.5">
                    Elena Rostova · Voltaic & Solar Craft
                  </p>
                  <p className="text-xs text-slate-300">
                    License #EL-CA-993821-M · Bonded $1M
                  </p>
                </div>
                <button
                  onClick={onExploreCivic}
                  className="px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded-lg shrink-0 transition-colors shadow-sm"
                >
                  View Tenders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
