import React from 'react';
import { 
  Sparkles, 
  Zap, 
  Wrench, 
  Trees, 
  Paintbrush, 
  Home, 
  Hammer, 
  Layers 
} from 'lucide-react';
import { ServiceCategoryId, ServiceCategory } from '../types.ts';
import { SERVICE_CATEGORIES } from '../data/mockData.ts';

interface CategoryNavProps {
  selectedCategory: ServiceCategoryId;
  onSelectCategory: (category: ServiceCategoryId) => void;
  countsByCategory: Record<ServiceCategoryId, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  countsByCategory,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      case 'Wrench':
        return <Wrench className="w-4 h-4" />;
      case 'Trees':
        return <Trees className="w-4 h-4" />;
      case 'Paintbrush':
        return <Paintbrush className="w-4 h-4" />;
      case 'Home':
        return <Home className="w-4 h-4" />;
      case 'Hammer':
        return <Hammer className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-2 mb-2">
          <h2 className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200 uppercase">
            Browse By Trade & Specialty
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Real-time verified availability
          </span>
        </div>

        {/* Horizontal scrollable category segmented buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SERVICE_CATEGORIES.map((cat: ServiceCategory) => {
            const isSelected = selectedCategory === cat.id;
            const count = countsByCategory[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className={isSelected ? 'text-indigo-300 dark:text-indigo-600' : 'text-slate-500 dark:text-slate-400'}>
                  {getCategoryIcon(cat.icon)}
                </span>
                <span>{cat.name}</span>
                <span className={`text-xs font-mono tabular-nums ${isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
