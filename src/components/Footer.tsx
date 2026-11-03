import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { ServiceCategoryId } from '../types.ts';

interface FooterProps {
  onSelectCategory: (cat: ServiceCategoryId) => void;
  onOpenCivic: () => void;
  onOpenHowItWorks: () => void;
  onOpenSaved?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenCivic,
  onOpenHowItWorks,
  onOpenSaved,
}) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Wordmark & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                CivicGuild
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The verified local marketplace connecting homeowners, beauty studios, master tradespeople, and municipal development initiatives with escrow-secured payments.
            </p>
          </div>

          {/* Col 2: Services Directory */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Trade Categories
            </h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onSelectCategory('beauty')} className="hover:text-indigo-600 transition-colors">
                  Beauty & Personal Care 💅
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('electrical')} className="hover:text-indigo-600 transition-colors">
                  Electricians & Solar ⚡
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('plumbing')} className="hover:text-indigo-600 transition-colors">
                  Plumbing & Hydronics 🔧
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('landscaping')} className="hover:text-indigo-600 transition-colors">
                  Landscaping & Grounds 🌿
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('painting')} className="hover:text-indigo-600 transition-colors">
                  Painters & Surface Finishes 🎨
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('roofing')} className="hover:text-indigo-600 transition-colors">
                  Roof Repairs & Gutters 🏠
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('maintenance')} className="hover:text-indigo-600 transition-colors">
                  Household Maintenance 🔨
                </button>
              </li>
              {onOpenSaved && (
                <li className="pt-1">
                  <button onClick={onOpenSaved} className="hover:text-rose-500 transition-colors flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>My Saved Shortlist</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Civic & Procurement */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Civic Development
            </h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={onOpenCivic} className="hover:text-indigo-600 transition-colors">
                  Municipal RFQ Registry
                </button>
              </li>
              <li>
                <button onClick={onOpenCivic} className="hover:text-indigo-600 transition-colors">
                  Neighborhood Park Projects
                </button>
              </li>
              <li>
                <button onClick={onOpenCivic} className="hover:text-indigo-600 transition-colors">
                  Historic Facade Preservation
                </button>
              </li>
              <li>
                <button onClick={onOpenCivic} className="hover:text-indigo-600 transition-colors">
                  Senior Center Accessibility
                </button>
              </li>
              <li>
                <button onClick={onOpenHowItWorks} className="hover:text-indigo-600 transition-colors">
                  Prevailing Wage & Vendor Standards
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Escrow Guarantee */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Security & Guarantee
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              All client payments are held in an escrow trust account. Licensed technicians are insured for up to $1,000,000 general liability.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              256-bit TLS encrypted transaction gateway.
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} CivicGuild Marketplace. Empowering local communities and skilled trades.</p>
          <p className="flex items-center gap-1">
            <span>Built for neighborhood economic resilience</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
