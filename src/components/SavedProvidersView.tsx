import React from 'react';
import { Heart, Search, ArrowRight, Trash2 } from 'lucide-react';
import { ServiceProvider } from '../types.ts';
import { ProviderCard } from './ProviderCard.tsx';

interface SavedProvidersViewProps {
  savedProviders: ServiceProvider[];
  onSelectProvider: (provider: ServiceProvider) => void;
  onBookSlot: (provider: ServiceProvider, dateString: string, timeSlot: string) => void;
  onToggleSave: (providerId: string) => void;
  onBrowseServices: () => void;
  onClearAllSaved: () => void;
}

export const SavedProvidersView: React.FC<SavedProvidersViewProps> = ({
  savedProviders,
  onSelectProvider,
  onBookSlot,
  onToggleSave,
  onBrowseServices,
  onClearAllSaved,
}) => {
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-rose-600 dark:text-rose-400 tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-current" />
            <span>Personal Bookmarks</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Providers & Artisans
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {savedProviders.length === 1
              ? '1 bookmarked professional saved for quick appointment scheduling'
              : `${savedProviders.length} bookmarked professionals saved for quick appointment scheduling`}
          </p>
        </div>

        {savedProviders.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={onClearAllSaved}
              className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Shortlist</span>
            </button>
            <button
              onClick={onBrowseServices}
              className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Explore More Trades</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {savedProviders.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No saved professionals yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-md mx-auto">
              Tap the heart icon on any contractor or stylist card while browsing to pin them here for fast re-booking and quote requests.
            </p>
          </div>
          <button
            onClick={onBrowseServices}
            className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Discover Verified Services</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {savedProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              isSaved={true}
              onToggleSave={onToggleSave}
              onSelect={onSelectProvider}
              onBookSlot={onBookSlot}
            />
          ))}
        </div>
      )}
    </div>
  );
};
