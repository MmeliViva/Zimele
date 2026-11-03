import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Send,
  PlusCircle,
  Users
} from 'lucide-react';
import { CivicProject, BidSubmission, ServiceProvider } from '../types.ts';

interface CivicProjectsSectionProps {
  projects: CivicProject[];
  providers: ServiceProvider[];
  onOpenNewProject: () => void;
  onSubmitBid: (projectId: string, bid: BidSubmission) => void;
}

export const CivicProjectsSection: React.FC<CivicProjectsSectionProps> = ({
  projects,
  providers,
  onOpenNewProject,
  onSubmitBid,
}) => {
  const [activeProject, setActiveProject] = useState<CivicProject | null>(null);
  const [biddingProjectId, setBiddingProjectId] = useState<string | null>(null);

  // Bid form state
  const [selectedProviderId, setSelectedProviderId] = useState<string>(providers[0]?.id || '');
  const [proposedBudget, setProposedBudget] = useState<number>(18000);
  const [timelineDays, setTimelineDays] = useState<number>(14);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [bidSubmittedToast, setBidSubmittedToast] = useState<boolean>(false);

  const handleOpenBidModal = (project: CivicProject) => {
    setBiddingProjectId(project.id);
    setProposedBudget(Math.round(project.targetBudget * 0.95));
    setCoverLetter(`We are fully certified for ${project.title}. Our local team has completed similar municipal scopes with full compliance.`);
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingProjectId) return;

    const pro = providers.find((p) => p.id === selectedProviderId) || providers[0];
    const newBid: BidSubmission = {
      id: `bid-${Date.now()}`,
      providerId: pro.id,
      providerName: pro.name,
      providerBusiness: pro.businessName,
      providerAvatar: pro.avatar,
      proposedBudget,
      estimatedTimelineDays: timelineDays,
      coverLetter,
      licenseVerified: true,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    onSubmitBid(biddingProjectId, newBid);
    setBiddingProjectId(null);
    setBidSubmittedToast(true);
    setTimeout(() => setBidSubmittedToast(false), 4000);
  };

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <span>Civic & Neighborhood Development</span>
              <span aria-hidden="true">·</span>
              <span>Local Talent Procurement Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight [text-wrap:balance]">
              Connecting City Initiatives & Neighborhood Projects with Local Artisans
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Local municipal departments and neighborhood associations publish vetted tenders for parks, historic restoration, and accessibility upgrades. Licensed local contractors submit transparent bids.
            </p>
          </div>

          <button
            onClick={onOpenNewProject}
            className="px-4 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Publish Civic Request for Quotes (RFQ)</span>
          </button>
        </div>

        {/* Toast confirmation */}
        {bidSubmittedToast && (
          <div className="mb-6 p-4 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Proposal Lodged Successfully:</strong> Your bid has been registered in the municipal procurement audit trail. The presiding department will review submissions.</span>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Image banner */}
              <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3">
                  <span className="font-mono text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md border border-white/20">
                    {project.projectCode}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs text-slate-300 font-medium">
                    {project.department}
                  </p>
                  <h3 className="text-base font-bold text-white drop-shadow truncate">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Content body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Metadata line */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {project.neighborhood}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Bids close {project.deadlineDate}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Scope bullets */}
                  <div className="mt-4 space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                      Key Scope Requirements:
                    </span>
                    {project.scopePoints.slice(0, 3).map((sp, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span className="line-clamp-1">{sp}</span>
                      </div>
                    ))}
                  </div>

                  {/* Citizen Benefit Callout */}
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white block mb-0.5">Community Benefit:</strong>
                    {project.featuredCitizenBenefit}
                  </div>
                </div>

                {/* Footer strip: Budget, Bids count, & Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Allocated Civic Budget</span>
                    <span className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      ${project.targetBudget.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-2">
                      ({project.bids.length} bids submitted)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenBidModal(project)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Bid</span>
                    </button>
                  </div>
                </div>

                {/* Existing bids preview if present */}
                {project.bids.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                      Recent Bids Under Municipal Review:
                    </span>
                    <div className="space-y-1.5">
                      {project.bids.map((bid) => (
                        <div key={bid.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {bid.providerBusiness}
                          </span>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                              ${bid.proposedBudget.toLocaleString()}
                            </span>
                            <span className="text-[10px] uppercase font-mono text-slate-400">
                              {bid.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Bid Submission Modal */}
      {biddingProjectId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Submit Civic Tender Proposal
                </h3>
                <p className="text-xs text-slate-500">
                  Municipal procurement portal for verified contractors
                </p>
              </div>
              <button
                onClick={() => setBiddingProjectId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Select Submitting Trade Provider Profile
                </label>
                <select
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.businessName} ({p.name}) · License {p.licenseNumber || 'Active'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Proposed Total Bid ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Estimated Timeline (Days)
                  </label>
                  <input
                    type="number"
                    required
                    value={timelineDays}
                    onChange={(e) => setTimelineDays(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Scope Execution Proposal & Qualifications
                </label>
                <textarea
                  rows={4}
                  required
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>By submitting, you certify active general liability insurance and agree to prevailing wage municipal standards.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBiddingProjectId(null)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  Confirm & Submit Tender Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
