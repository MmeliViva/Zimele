import React, { useState } from 'react';
import { X, Building2, MapPin, DollarSign, Calendar, ShieldCheck, FileCheck } from 'lucide-react';
import { CivicProject, ServiceCategoryId } from '../types.ts';

interface PostCivicProjectModalProps {
  onClose: () => void;
  onProjectCreated: (project: CivicProject) => void;
}

export const PostCivicProjectModal: React.FC<PostCivicProjectModalProps> = ({
  onClose,
  onProjectCreated,
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Neighborhood Improvement Association');
  const [neighborhood, setNeighborhood] = useState('Central Commons');
  const [category, setCategory] = useState<ServiceCategoryId>('maintenance');
  const [budget, setBudget] = useState(12500);
  const [deadline, setDeadline] = useState('2026-12-15');
  const [completionTarget, setCompletionTarget] = useState('2027-01-10');
  const [description, setDescription] = useState('');
  const [scopePointsText, setScopePointsText] = useState('Procure materials and equipment\nLicensed local labor execution\nSafety inspection and cleanup');
  const [citizenBenefit, setCitizenBenefit] = useState('Improves neighborhood safety, accessibility, and community pride.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const code = `RFQ-COMM-${Math.floor(1000 + Math.random() * 9000)}`;
    const scopePoints = scopePointsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newProject: CivicProject = {
      id: `civic-${Date.now()}`,
      projectCode: code,
      title,
      department,
      neighborhood,
      category,
      targetBudget: Number(budget),
      deadlineDate: deadline,
      completionTargetDate: completionTarget,
      description: description || 'Civic infrastructure and neighborhood improvement project seeking licensed local talent.',
      scopePoints: scopePoints.length > 0 ? scopePoints : ['Complete installation to municipal code'],
      requiredCredentials: ['Active Trade License', 'General Liability Insurance ($1M+)', 'City Registered Vendor'],
      image: '/src/assets/images/civic_community_park_1793666366331.jpg',
      status: 'open_for_bids',
      bids: [],
      featuredCitizenBenefit: citizenBenefit,
    };

    onProjectCreated(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Publish Civic Tender / Community RFQ
              </h3>
              <p className="text-[11px] text-slate-500">
                Connect municipal & neighborhood initiatives with licensed local talent
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              placeholder="E.g. Community Plaza Solar Lighting & Native Planting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Issuing Department or Association
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Neighborhood District
              </label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Primary Trade Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategoryId)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="electrical">Electrical & Solar</option>
                <option value="plumbing">Plumbing & Water</option>
                <option value="landscaping">Landscaping & Grounds</option>
                <option value="painting">Painting & Finishes</option>
                <option value="roofing">Roofing & Gutters</option>
                <option value="maintenance">Maintenance & Carpentry</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Target Budget ($)
              </label>
              <input
                type="number"
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Bids Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Project Overview & Specification
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe the initiative, physical requirements, timeline constraints..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Scope of Work Items (one per line)
            </label>
            <textarea
              rows={3}
              value={scopePointsText}
              onChange={(e) => setScopePointsText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Neighborhood & Citizen Benefit
            </label>
            <input
              type="text"
              value={citizenBenefit}
              onChange={(e) => setCitizenBenefit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
            >
              Publish to Civic Tenders Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
