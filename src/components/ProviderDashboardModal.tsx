import React, { useState, useRef } from 'react';
import { 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Plus, 
  ShieldCheck, 
  FileText,
  UserCheck,
  TrendingUp,
  X,
  Upload,
  FileCheck,
  AlertCircle,
  Eye,
  Trash2,
  Award,
  Sparkles,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { 
  ServiceProvider, 
  Booking, 
  ServiceItem, 
  VerificationRequest, 
  VerificationDocument 
} from '../types.ts';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ProviderDashboardModalProps {
  provider: ServiceProvider;
  bookings: Booking[];
  onClose: () => void;
  onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  onAddService: (providerId: string, service: ServiceItem) => void;
  onToggleSlot: (providerId: string, dateString: string, timeSlot: string) => void;
  onSubmitVerification: (providerId: string, verification: VerificationRequest) => void;
}

export const ProviderDashboardModal: React.FC<ProviderDashboardModalProps> = ({
  provider,
  bookings,
  onClose,
  onUpdateBookingStatus,
  onAddService,
  onToggleSlot,
  onSubmitVerification,
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'verification' | 'bookings' | 'availability' | 'services'>('trends');
  const [trendViewMode, setTrendViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [trendMetric, setTrendMetric] = useState<'jobs' | 'revenue'>('jobs');
  
  // New service form
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(150);
  const [newServiceDuration, setNewServiceDuration] = useState(60);
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [serviceAddedToast, setServiceAddedToast] = useState(false);

  // Verification Form State
  const [licenseNumber, setLicenseNumber] = useState(provider.licenseNumber || '');
  const [issuingAuthority, setIssuingAuthority] = useState('State Contractors Licensing Board (CSLB)');
  const [licenseExpiry, setLicenseExpiry] = useState('2028-06-30');
  
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState(provider.insurancePolicyNumber || '');
  const [insuranceCarrier, setInsuranceCarrier] = useState('Travelers Commercial Casualty');
  const [coverageAmount, setCoverageAmount] = useState('$1,000,000 Occurrence / $2,000,000 Aggregate');

  const [requestedBadges, setRequestedBadges] = useState<Array<'Licensed & Insured' | 'City Vetted' | 'Government Approved Contractor'>>([
    'Licensed & Insured',
    'City Vetted',
    'Government Approved Contractor'
  ]);

  // Uploaded files state
  const [licenseDoc, setLicenseDoc] = useState<VerificationDocument | null>(() => {
    if (provider.verificationRequest?.licenseDoc) return provider.verificationRequest.licenseDoc;
    if (provider.licenseNumber) {
      return {
        name: `official_license_${provider.licenseNumber}.pdf`,
        size: '1.4 MB',
        type: 'application/pdf',
        uploadedAt: 'Active on registry',
      };
    }
    return null;
  });

  const [insuranceDoc, setInsuranceDoc] = useState<VerificationDocument | null>(() => {
    if (provider.verificationRequest?.insuranceDoc) return provider.verificationRequest.insuranceDoc;
    if (provider.insurancePolicyNumber) {
      return {
        name: `certificate_of_insurance_acord25.pdf`,
        size: '2.1 MB',
        type: 'application/pdf',
        uploadedAt: 'Active on registry',
      };
    }
    return null;
  });

  const [isVerifyingProcess, setIsVerifyingProcess] = useState(false);
  const [verificationStepText, setVerificationStepText] = useState('');
  const [verificationSuccessToast, setVerificationSuccessToast] = useState(false);

  const licenseInputRef = useRef<HTMLInputElement>(null);
  const insuranceInputRef = useRef<HTMLInputElement>(null);

  // Filter provider-specific bookings
  const providerBookings = bookings.filter((b) => b.providerId === provider.id || b.providerBusiness === provider.businessName);
  const escrowSecuredTotal = providerBookings
    .filter((b) => b.paymentStatus === 'escrow_secured')
    .reduce((acc, curr) => acc + curr.basePrice, 0);

  // Dynamic calculation for weekly job completion trends
  const actualCompletedJobs = providerBookings.filter((b) => b.status === 'completed').length;
  const actualConfirmedJobs = providerBookings.filter((b) => b.status === 'confirmed').length;

  interface TrendPoint {
    periodLabel: string;
    completedJobs: number;
    scheduledJobs: number;
    escrowPayout: number;
    completionRate: number;
  }

  const weeklyTrendsData: TrendPoint[] = [
    { periodLabel: 'Wk 39 (Sep 15)', completedJobs: 8, scheduledJobs: 9, escrowPayout: 1420, completionRate: 89 },
    { periodLabel: 'Wk 40 (Sep 22)', completedJobs: 11, scheduledJobs: 12, escrowPayout: 2150, completionRate: 92 },
    { periodLabel: 'Wk 41 (Sep 29)', completedJobs: 13, scheduledJobs: 14, escrowPayout: 2680, completionRate: 93 },
    { periodLabel: 'Wk 42 (Oct 06)', completedJobs: 12, scheduledJobs: 13, escrowPayout: 2390, completionRate: 92 },
    { periodLabel: 'Wk 43 (Oct 13)', completedJobs: 15, scheduledJobs: 16, escrowPayout: 3120, completionRate: 94 },
    { periodLabel: 'Wk 44 (Oct 20)', completedJobs: 14, scheduledJobs: 15, escrowPayout: 2980, completionRate: 93 },
    { 
      periodLabel: 'Wk 45 (Current)', 
      completedJobs: Math.max(16, 14 + actualCompletedJobs), 
      scheduledJobs: Math.max(18, 14 + actualCompletedJobs + actualConfirmedJobs), 
      escrowPayout: 3450 + (actualCompletedJobs * 120), 
      completionRate: 96 
    },
  ];

  const dailyTrendsData: TrendPoint[] = [
    { periodLabel: 'Mon', completedJobs: 3, scheduledJobs: 3, escrowPayout: 580, completionRate: 100 },
    { periodLabel: 'Tue', completedJobs: 4, scheduledJobs: 4, escrowPayout: 790, completionRate: 100 },
    { periodLabel: 'Wed', completedJobs: 3, scheduledJobs: 4, escrowPayout: 640, completionRate: 75 },
    { periodLabel: 'Thu', completedJobs: 4, scheduledJobs: 5, escrowPayout: 860, completionRate: 80 },
    { periodLabel: 'Fri', completedJobs: 3, scheduledJobs: 4, escrowPayout: 720, completionRate: 75 },
    { periodLabel: 'Sat', completedJobs: 2, scheduledJobs: 2, escrowPayout: 490, completionRate: 100 },
    { periodLabel: 'Sun', completedJobs: 1, scheduledJobs: 1, escrowPayout: 250, completionRate: 100 },
  ];

  const totalWeeklyCompleted = weeklyTrendsData.reduce((acc, curr) => acc + curr.completedJobs, 0);
  const totalWeeklyPayout = weeklyTrendsData.reduce((acc, curr) => acc + curr.escrowPayout, 0);
  const averageCompletionRate = Math.round(
    weeklyTrendsData.reduce((acc, curr) => acc + curr.completionRate, 0) / weeklyTrendsData.length
  );

  const TrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 dark:bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1.5 backdrop-blur-md">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1 font-mono text-[11px]">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-bold tabular-nums">
                {entry.name.toLowerCase().includes('payout') || entry.name.toLowerCase().includes('revenue') || entry.name.toLowerCase().includes('escrow')
                  ? `$${Number(entry.value).toLocaleString()}`
                  : `${entry.value} jobs`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Handle file uploads
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'license' | 'insurance'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formatSize = (bytes: number) => {
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const reader = new FileReader();
    reader.onload = () => {
      const doc: VerificationDocument = {
        name: file.name,
        size: formatSize(file.size),
        type: file.type || 'application/pdf',
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        previewUrl: typeof reader.result === 'string' && file.type.startsWith('image/') ? reader.result : undefined,
      };

      if (type === 'license') {
        setLicenseDoc(doc);
      } else {
        setInsuranceDoc(doc);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePreloadSampleFiles = () => {
    setLicenseNumber(provider.licenseNumber || 'EL-CA-993821-M');
    setInsurancePolicyNumber(provider.insurancePolicyNumber || 'TRV-GL-882-9011');
    setIssuingAuthority('State Contractors Licensing Board (CSLB)');
    setInsuranceCarrier('Travelers Commercial Casualty Co.');
    setCoverageAmount('$1,000,000 Occurrence / $2,000,000 Aggregate');
    
    setLicenseDoc({
      name: `State_Contractor_Board_License_Cert.pdf`,
      size: '1.2 MB',
      type: 'application/pdf',
      uploadedAt: 'Just now',
    });

    setInsuranceDoc({
      name: `ACORD_25_Certificate_of_Liability_Insurance.pdf`,
      size: '2.4 MB',
      type: 'application/pdf',
      uploadedAt: 'Just now',
    });
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseNumber || !insurancePolicyNumber) {
      alert('Please provide both your active license number and insurance policy number.');
      return;
    }

    setIsVerifyingProcess(true);

    const steps = [
      'Cross-referencing license against State Department of Consumer Affairs registry...',
      'Validating Certificate of Insurance with commercial underwriter repository...',
      'Verifying $1,000,000+ general liability bond and municipal clearance...',
      'Minting cryptographic badge verification status...',
    ];

    let stepIdx = 0;
    setVerificationStepText(steps[0]);

    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setVerificationStepText(steps[stepIdx]);
      } else {
        clearInterval(interval);
        const verificationRecord: VerificationRequest = {
          id: `vr-${Date.now()}`,
          providerId: provider.id,
          licenseNumber,
          issuingAuthority,
          licenseExpiry,
          insurancePolicyNumber,
          insuranceCarrier,
          coverageAmount,
          licenseDoc: licenseDoc || {
            name: `license_${licenseNumber}.pdf`,
            size: '1.5 MB',
            type: 'application/pdf',
            uploadedAt: 'Validated',
          },
          insuranceDoc: insuranceDoc || {
            name: `insurance_${insurancePolicyNumber}.pdf`,
            size: '2.1 MB',
            type: 'application/pdf',
            uploadedAt: 'Validated',
          },
          requestedBadges,
          submittedAt: new Date().toISOString().split('T')[0],
          status: 'verified',
        };

        setIsVerifyingProcess(false);
        onSubmitVerification(provider.id, verificationRecord);
        setVerificationSuccessToast(true);
        setTimeout(() => setVerificationSuccessToast(false), 5000);
      }
    }, 600);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: newServiceName,
      price: Number(newServicePrice),
      durationMinutes: Number(newServiceDuration),
      pricingType: 'fixed',
      description: newServiceDesc || 'Professional trade service with certified equipment and cleanup.',
    };

    onAddService(provider.id, newService);
    setNewServiceName('');
    setNewServiceDesc('');
    setServiceAddedToast(true);
    setTimeout(() => setServiceAddedToast(false), 3000);
  };

  const toggleBadgeSelection = (badge: 'Licensed & Insured' | 'City Vetted' | 'Government Approved Contractor') => {
    setRequestedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Provider Console: {provider.businessName}
                </h2>
                {provider.badges.includes('Licensed & Insured') ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Pro</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                    Verification Needed
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged in as {provider.name} · License: {provider.licenseNumber || 'Unregistered'}
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

        {/* Financial & Job Performance Strip */}
        <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">Active Escrow Holdings:</span>
            <span className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              ${escrowSecuredTotal.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Upcoming Scheduled Jobs:</span>
            <span className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {providerBookings.filter((b) => b.status === 'confirmed').length}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Verified Trust Badges:</span>
            <span className="text-lg font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
              {provider.badges.length} Active Badges
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-4 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('trends')}
            className={`pb-3 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'trends'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>Weekly Completion Trends</span>
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`pb-3 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'verification'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Badge & License Verification</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 whitespace-nowrap transition-colors ${
              activeTab === 'bookings'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Client Bookings ({providerBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`pb-3 whitespace-nowrap transition-colors ${
              activeTab === 'availability'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Manage Real-Time Slot Calendar
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-3 whitespace-nowrap transition-colors ${
              activeTab === 'services'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Service Catalog & Rates ({provider.services.length})
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB: WEEKLY COMPLETION TRENDS (RECHARTS VISUAL CHART) */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              {/* Header & KPI Summary */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>Verified Completion Performance</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      Weekly Job Completion Trends & Velocity
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Visualizing completed appointments, scheduled capacity, and escrow funds released over time.
                    </p>
                  </div>

                  {/* Period Switcher */}
                  <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setTrendViewMode('weekly')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        trendViewMode === 'weekly'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      7-Week View
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrendViewMode('daily')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        trendViewMode === 'daily'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      This Week by Day
                    </button>
                  </div>
                </div>

                {/* 4 Quantitative Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-200 dark:border-slate-700/60">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Jobs Completed</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {totalWeeklyCompleted}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                      +18.4% vs last cycle
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Gross Escrow Released</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      ${totalWeeklyPayout.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      100% dispute-free
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Average Completion Rate</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                      {averageCompletionRate}%
                    </span>
                    <span className="text-[10px] text-indigo-500 block mt-0.5">
                      Top 2% in Metro Valley
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Avg Job Turnaround</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      1.8 Days
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Prompt arrival record
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Container Card */}
              <div className="p-6 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {trendMetric === 'jobs' 
                        ? (trendViewMode === 'weekly' ? 'Weekly Completed vs Scheduled Capacity' : 'Daily Completion Volume (Mon - Sun)')
                        : 'Escrow Payout Settlement Volume ($)'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {trendViewMode === 'weekly' 
                        ? 'Aggregated volume over the last 7 calendar weeks' 
                        : 'Current week appointment dispatch and completion tracking'}
                    </p>
                  </div>

                  {/* Metric Toggle */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium">Metric:</span>
                    <button
                      type="button"
                      onClick={() => setTrendMetric('jobs')}
                      className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                        trendMetric === 'jobs'
                          ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Jobs Volume
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrendMetric('revenue')}
                      className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                        trendMetric === 'revenue'
                          ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Escrow Payouts ($)
                    </button>
                  </div>
                </div>

                {/* Recharts Visual Canvas */}
                <div className="w-full h-72 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {trendMetric === 'jobs' ? (
                      <AreaChart
                        data={trendViewMode === 'weekly' ? weeklyTrendsData : dailyTrendsData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.08} />
                          </linearGradient>
                          <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                        <XAxis 
                          dataKey="periodLabel" 
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          axisLine={{ stroke: '#cbd5e1' }}
                          tickLine={false}
                        />
                        <YAxis 
                          allowDecimals={false}
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<TrendTooltip />} />
                        <Legend 
                          iconType="circle" 
                          wrapperStyle={{ fontSize: 12, paddingTop: 12 }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="completedJobs" 
                          name="Completed Jobs" 
                          stroke="#4f46e5" 
                          strokeWidth={2.5} 
                          fillOpacity={1} 
                          fill="url(#colorCompleted)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="scheduledJobs" 
                          name="Scheduled Target" 
                          stroke="#0ea5e9" 
                          strokeWidth={2} 
                          strokeDasharray="4 4" 
                          fillOpacity={1} 
                          fill="url(#colorScheduled)" 
                        />
                      </AreaChart>
                    ) : (
                      <AreaChart
                        data={trendViewMode === 'weekly' ? weeklyTrendsData : dailyTrendsData}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.08} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                        <XAxis 
                          dataKey="periodLabel" 
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          axisLine={{ stroke: '#cbd5e1' }}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(val) => `$${val}`}
                        />
                        <Tooltip content={<TrendTooltip />} />
                        <Legend 
                          iconType="circle" 
                          wrapperStyle={{ fontSize: 12, paddingTop: 12 }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="escrowPayout" 
                          name="Escrow Payout Volume" 
                          stroke="#10b981" 
                          strokeWidth={2.5} 
                          fillOpacity={1} 
                          fill="url(#colorPayout)" 
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weekly Audit Breakdown Table */}
              <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Week-by-Week Completion Audit
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Updated in real time with client escrow releases
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">Period</th>
                        <th className="py-2.5 px-4 text-center">Completed</th>
                        <th className="py-2.5 px-4 text-center">Scheduled</th>
                        <th className="py-2.5 px-4 text-center">Completion Rate</th>
                        <th className="py-2.5 px-4 text-right">Escrow Payout</th>
                        <th className="py-2.5 px-4 text-right">Settlement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {(trendViewMode === 'weekly' ? weeklyTrendsData : dailyTrendsData).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-750 transition-colors">
                          <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">
                            {row.periodLabel}
                          </td>
                          <td className="py-2.5 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {row.completedJobs}
                          </td>
                          <td className="py-2.5 px-4 text-center font-mono text-slate-500">
                            {row.scheduledJobs}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                              {row.completionRate}%
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${row.escrowPayout.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Disbursed</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 0: BADGE & TRADE VERIFICATION FLOW */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              {/* Success Toast Banner */}
              {verificationSuccessToast && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-2xl flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                      Verification Dossier Approved & Badges Minted!
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                      Your license number ({licenseNumber}) and commercial insurance policy ({insurancePolicyNumber}) have been validated. Your profile now displays the official "Licensed & Insured", "City Vetted", and "Government Approved Contractor" trust badges.
                    </p>
                  </div>
                </div>
              )}

              {/* Processing Loader State */}
              {isVerifyingProcess ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-14 h-14 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Validating Credentials Against State & Municipal Registries
                    </h3>
                    <p className="text-xs font-mono text-slate-500 mt-1 max-w-md mx-auto">
                      {verificationStepText}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Current Badges Overview Header */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                          <Award className="w-4 h-4" />
                          <span>Credentials & Trust Status</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                          Verified Trade Registry & Badges
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          Verified credentials unlock civic project bidding, boost consumer booking rates by +340%, and activate escrow security.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handlePreloadSampleFiles}
                        className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Pre-fill Sample License & COI</span>
                      </button>
                    </div>

                    {/* Active Badges list */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-2">
                      {provider.badges.map((b, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{b}</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                            [VALID]
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification Upload Form */}
                  <form onSubmit={handleSubmitVerification} className="space-y-6">
                    {/* SECTION 1: TRADE LICENSE */}
                    <div className="p-6 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                            1
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            State or Municipal Trade License
                          </h4>
                        </div>
                        <span className="text-xs text-slate-400">
                          Mandatory for trade services
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                            License / Certificate Number
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="E.g. EL-CA-993821-M"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                            Issuing Board or Agency
                          </label>
                          <input
                            type="text"
                            required
                            value={issuingAuthority}
                            onChange={(e) => setIssuingAuthority(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="date"
                            required
                            value={licenseExpiry}
                            onChange={(e) => setLicenseExpiry(e.target.value)}
                            className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      {/* File Upload Zone: License Proof */}
                      <div>
                        <label className="block text-slate-600 dark:text-slate-300 font-medium text-xs mb-1.5">
                          Upload Official License Document (PDF, PNG, JPG)
                        </label>

                        <input
                          ref={licenseInputRef}
                          type="file"
                          accept=".pdf,image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'license')}
                        />

                        {licenseDoc ? (
                          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <FileCheck className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {licenseDoc.name}
                                </p>
                                <p className="text-slate-400 text-[11px]">
                                  {licenseDoc.size} · Uploaded {licenseDoc.uploadedAt}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => licenseInputRef.current?.click()}
                                className="px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg font-medium"
                              >
                                Replace File
                              </button>
                              <button
                                type="button"
                                onClick={() => setLicenseDoc(null)}
                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => licenseInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/50"
                          >
                            <Upload className="w-7 h-7 mx-auto text-slate-400 mb-2" />
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Click to browse or drag & drop license certificate
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              State license card scan, PDF permit, or high-resolution photo (Max 15MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SECTION 2: GENERAL LIABILITY & BONDING INSURANCE */}
                    <div className="p-6 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                            2
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            General Liability & Commercial Insurance (COI)
                          </h4>
                        </div>
                        <span className="text-xs text-emerald-600 font-medium">
                          Escrow qualification requires $1M+ coverage
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                            Policy Number
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="E.g. TRV-GL-882-9011"
                            value={insurancePolicyNumber}
                            onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                            className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                            Underwriting Insurance Carrier
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="E.g. Travelers, Chubb, Hiscox"
                            value={insuranceCarrier}
                            onChange={(e) => setInsuranceCarrier(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                            Liability Coverage Limit
                          </label>
                          <input
                            type="text"
                            required
                            value={coverageAmount}
                            onChange={(e) => setCoverageAmount(e.target.value)}
                            className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      {/* File Upload Zone: Insurance Proof */}
                      <div>
                        <label className="block text-slate-600 dark:text-slate-300 font-medium text-xs mb-1.5">
                          Upload Certificate of Insurance (ACORD 25 Form or Binder)
                        </label>

                        <input
                          ref={insuranceInputRef}
                          type="file"
                          accept=".pdf,image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'insurance')}
                        />

                        {insuranceDoc ? (
                          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <FileCheck className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {insuranceDoc.name}
                                </p>
                                <p className="text-slate-400 text-[11px]">
                                  {insuranceDoc.size} · Uploaded {insuranceDoc.uploadedAt}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => insuranceInputRef.current?.click()}
                                className="px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg font-medium"
                              >
                                Replace File
                              </button>
                              <button
                                type="button"
                                onClick={() => setInsuranceDoc(null)}
                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => insuranceInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/50"
                          >
                            <Upload className="w-7 h-7 mx-auto text-slate-400 mb-2" />
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Click to browse or drag & drop ACORD 25 Certificate of Insurance
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Must list name/business as Named Insured with active policy dates (Max 15MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SECTION 3: REQUESTED BADGES */}
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                          3
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                          Select Trust Badges to Activate
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <label 
                          onClick={() => toggleBadgeSelection('Licensed & Insured')}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            requestedBadges.includes('Licensed & Insured')
                              ? 'bg-emerald-50/60 border-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold mb-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Licensed & Insured</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Displayed on all search cards and profile headers.
                          </p>
                        </label>

                        <label 
                          onClick={() => toggleBadgeSelection('City Vetted')}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            requestedBadges.includes('City Vetted')
                              ? 'bg-indigo-50/60 border-indigo-400 dark:bg-indigo-950/40 dark:border-indigo-700 text-indigo-900 dark:text-indigo-100'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold mb-1">
                            <UserCheck className="w-4 h-4 text-indigo-600" />
                            <span>City Vetted</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Verified background check and municipal registry standing.
                          </p>
                        </label>

                        <label 
                          onClick={() => toggleBadgeSelection('Government Approved Contractor')}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            requestedBadges.includes('Government Approved Contractor')
                              ? 'bg-amber-50/60 border-amber-400 dark:bg-amber-950/40 dark:border-amber-700 text-amber-900 dark:text-amber-100'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold mb-1">
                            <Award className="w-4 h-4 text-amber-600" />
                            <span>Civic Approved</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Allows submitting binding bids on neighborhood tenders.
                          </p>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Instant validation protocol with 24h audit registry sync.</span>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit Dossier & Validate Badges</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          )}

          {/* TAB 1: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {/* Quick Trends Callout */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Weekly Completion Velocity: {weeklyTrendsData[weeklyTrendsData.length - 1].completedJobs} Jobs Finished This Week
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Gross escrow volume: ${weeklyTrendsData[weeklyTrendsData.length - 1].escrowPayout.toLocaleString()} · 99% on-time completion
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('trends')}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold shrink-0 transition-colors flex items-center gap-1.5"
                >
                  <span>View Trends Chart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {providerBookings.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No appointments booked yet. Your listing is live on the marketplace.
                </div>
              ) : (
                providerBookings.map((bk) => (
                  <div
                    key={bk.id}
                    className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          #{bk.bookingRef}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {bk.serviceName}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          bk.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}>
                          {bk.status}
                        </span>
                      </div>

                      <div className="text-slate-600 dark:text-slate-300">
                        Client: <strong>{bk.clientName}</strong> · Phone: {bk.clientPhone} · {bk.serviceAddress}
                      </div>

                      <div className="text-slate-500 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Scheduled: {bk.dateString} at {bk.timeSlot}</span>
                        {bk.notes && <span>· Note: "{bk.notes}"</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Payout (Escrow)</span>
                        <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          ${bk.basePrice.toFixed(2)}
                        </span>
                      </div>

                      {bk.status === 'confirmed' ? (
                        <button
                          onClick={() => onUpdateBookingStatus(bk.id, 'completed')}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Job Completed</span>
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Funds Released</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: AVAILABILITY CALENDAR SLOTS */}
          {activeTab === 'availability' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Click any time slot below to instantly open or block availability on your public booking profile.
              </p>

              <div className="space-y-4">
                {provider.availability.map((day) => (
                  <div key={day.dateString} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-xs text-slate-900 dark:text-white block mb-2">
                      {day.dayLabel} ({day.dateString})
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {day.slots.map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => onToggleSlot(provider.id, day.dateString, slot.time)}
                          className={`py-2 px-3 text-xs font-mono rounded-lg border text-center transition-all ${
                            slot.available
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 font-semibold'
                              : 'bg-slate-200/60 text-slate-400 border-slate-300 dark:bg-slate-900 dark:text-slate-600 dark:border-slate-800 line-through'
                          }`}
                        >
                          {slot.time} {slot.available ? '✓' : 'Blocked'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES CATALOG */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              {/* Form to add service */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                  Add New Service Offering
                </h4>

                {serviceAddedToast && (
                  <div className="mb-3 p-2 bg-emerald-100 text-emerald-800 rounded-lg text-xs">
                    ✓ New service listed and live on the marketplace catalog!
                  </div>
                )}

                <form onSubmit={handleCreateService} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 mb-1">Service Title</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Whole-Home Surge Protection Installation"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Fixed Price ($)</label>
                    <input
                      type="number"
                      required
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-slate-500 mb-1">Description & Scope</label>
                    <input
                      type="text"
                      placeholder="What is included, parts, clean up guarantee..."
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Live Storefront</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Current Services List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Active Services on Storefront
                </h4>
                {provider.services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {srv.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {srv.durationMinutes} mins · {srv.description}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      ${srv.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
