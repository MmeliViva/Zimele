import React from 'react';
import { ShieldCheck, Calendar, Lock, Users, Building2, CheckCircle2, Award } from 'lucide-react';

interface HowItWorksViewProps {
  onStartBrowsing: () => void;
  onExploreTenders: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  onStartBrowsing,
  onExploreTenders,
}) => {
  return (
    <div className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
            <span>Community Trust & Escrow Architecture</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight [text-wrap:balance]">
            How CivicGuild Protects Homeowners, Stylists, Trades & Municipalities
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            A unified local marketplace built on verified licenses, guaranteed real-time availability, and neutral escrow protection.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Vetted Trades & Registered Specialists
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Every professional lists verifiable state licensing, minimum $1,000,000 general liability insurance policies, and municipal contractor clearances. No unverified freelancers or anonymous accounts.
            </p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Real-Time Calendar Availability
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Say goodbye to phone tag and unreturned voicemails. View exact open calendar windows for today, tomorrow, or next week. Instant booking locks the slot on both the customer and technician's schedule.
            </p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Neutral Escrow Payment Gateway
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When booking, your funds are secured in a neutral trust account. Payment is not released to the service provider until you have inspected the finished job and marked it complete in your portal.
            </p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Civic & Neighborhood Development
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Municipal departments and neighborhood associations publish tenders for parks, historic restorations, and ADA upgrades. Local businesses bid directly, keeping tax dollars inside the community.
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartBrowsing}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold text-xs rounded-xl shadow-sm transition-colors text-center"
          >
            Explore Verified Services Directory
          </button>
          <button
            onClick={onExploreTenders}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors text-center"
          >
            Browse Community & Civic Tenders
          </button>
        </div>
      </div>
    </div>
  );
};
