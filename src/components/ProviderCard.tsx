import React from 'react';
import { Star, ShieldCheck, Clock, MapPin, Calendar, ArrowRight, Heart } from 'lucide-react';
import { ServiceProvider } from '../types.ts';

interface ProviderCardProps {
  provider: ServiceProvider;
  onSelect: (provider: ServiceProvider) => void;
  onBookSlot: (provider: ServiceProvider, dateString: string, timeSlot: string) => void;
  isSaved?: boolean;
  onToggleSave?: (providerId: string) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  onSelect,
  onBookSlot,
  isSaved = false,
  onToggleSave,
}) => {
  // Find the first available slot
  const nextAvailableDay = provider.availability.find((d) =>
    d.slots.some((s) => s.available)
  );
  const nextSlot = nextAvailableDay?.slots.find((s) => s.available);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative">
      {/* Top Cover Image & Visual */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={provider.coverImage}
          alt={provider.businessName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback gradient if external fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Heart Save Button */}
        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(provider.id);
            }}
            aria-label={isSaved ? `Remove ${provider.businessName} from saved` : `Save ${provider.businessName}`}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md z-10 border border-white/10"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isSaved
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-white hover:text-rose-300'
              }`}
            />
          </button>
        )}

        {/* Floating Provider Avatar & Quick Trust Pin */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={provider.avatar}
              alt={provider.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm bg-slate-700"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white drop-shadow truncate">
                {provider.name}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-200">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{provider.location.neighborhood}</span>
              </div>
            </div>
          </div>

          {/* Licensed mark */}
          {provider.badges.includes('Licensed & Insured') && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Licensed</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with separators */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {provider.category.toUpperCase()}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{provider.responseTimeMinutes}m reply</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{provider.yearsInBusiness} yrs pro</span>
          </div>

          {/* Business Name */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {provider.businessName}
          </h3>

          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {provider.headline}
          </p>

          {/* Specialties unboxed text list */}
          <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
            {provider.specialties.slice(0, 3).map((spec, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span>{spec}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Rating, Price, & Action Area */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            {/* Rating */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-mono tabular-nums">{provider.rating.toFixed(2)}</span>
              <span className="text-slate-400 font-normal">({provider.reviewCount})</span>
            </div>

            {/* Price */}
            <div className="text-right">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Starting at</span>
              <span className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                ${provider.startingPrice}
              </span>
              {provider.hourlyRate && (
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 font-mono">
                  (${provider.hourlyRate}/hr)
                </span>
              )}
            </div>
          </div>

          {/* Next Available Slot Clickable Banner */}
          {nextAvailableDay && nextSlot && (
            <div className="mb-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Next slot: <strong>{nextAvailableDay.dayLabel}</strong>, {nextSlot.time}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookSlot(provider, nextAvailableDay.dateString, nextSlot.time);
                }}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Instant Book
              </button>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => onSelect(provider)}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>View Services & Real-Time Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
