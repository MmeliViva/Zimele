import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Briefcase, 
  UserCheck, 
  Building2, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Award
} from 'lucide-react';
import { UserAccount, UserRole, ServiceCategoryId, ServiceProvider } from '../types.ts';
import { SERVICE_CATEGORIES } from '../data/mockData.ts';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onLogin: (user: UserAccount) => void;
  onSignup: (user: UserAccount, newProviderProfile?: ServiceProvider) => void;
  allUsers: UserAccount[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
  onLogin,
  onSignup,
  allUsers,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Sign-in states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign-up states
  const [signupRole, setSignupRole] = useState<UserRole>('client');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Client details
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Old Town & East Ward');

  // Provider / Trader details
  const [businessName, setBusinessName] = useState('');
  const [tradeCategory, setTradeCategory] = useState<ServiceCategoryId>('electrical');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [startingPrice, setStartingPrice] = useState('95');
  const [yearsExperience, setYearsExperience] = useState('5');

  // Civic Official details
  const [agencyDepartment, setAgencyDepartment] = useState('Department of Community Development');
  const [badgeId, setBadgeId] = useState('GOV-VALLEY-');

  const [signupError, setSignupError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  if (!isOpen) return null;

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const found = allUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (!found) {
      setLoginError('No registered account found with this email. Please check your spelling or sign up below.');
      return;
    }

    onLogin(found);
    onClose();
  };

  const handleQuickDemoLogin = (user: UserAccount) => {
    onLogin(user);
    onClose();
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!fullName.trim()) {
      setSignupError('Please provide your full legal or trading name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSignupError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }
    if (!agreedToTerms) {
      setSignupError('Please accept the CivicGuild Code of Conduct & Escrow Terms.');
      return;
    }

    const existing = allUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (existing) {
      setSignupError('An account with this email address already exists. Please log in.');
      return;
    }

    const userId = `user-${Date.now()}`;
    let newProviderId: string | undefined = undefined;
    let newProviderProfile: ServiceProvider | undefined = undefined;

    // Generate avatar seed
    const avatar = signupRole === 'provider'
      ? 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80'
      : signupRole === 'civic_official'
      ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

    if (signupRole === 'provider') {
      newProviderId = `pro-${Date.now()}`;
      const startingNum = parseFloat(startingPrice) || 85;
      const categoryMeta = SERVICE_CATEGORIES.find((c) => c.id === tradeCategory);

      newProviderProfile = {
        id: newProviderId,
        name: fullName,
        businessName: businessName.trim() || `${fullName}'s ${categoryMeta?.name || 'Trades'} Services`,
        headline: `Licensed ${categoryMeta?.name || 'Trade'} Specialist`,
        avatar,
        coverImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
        category: tradeCategory,
        specialties: [categoryMeta?.name || 'General Service', 'Residential Repair', 'Emergency Callouts'],
        rating: 5.0,
        reviewCount: 0,
        completedJobsCount: 0,
        startingPrice: startingNum,
        hourlyRate: startingNum,
        location: {
          neighborhood: neighborhood || 'Metro Valley Central',
          city: 'Metro Valley',
          distanceMiles: 1.2,
          servicingRadiusMiles: 20,
        },
        badges: ['Licensed & Insured'],
        yearsInBusiness: parseInt(yearsExperience) || 3,
        responseTimeMinutes: 15,
        bio: `${fullName} is a registered professional serving local clients and municipal projects with certified quality and transparent escrow rates.`,
        licenseNumber: licenseNumber.trim() || `TRADE-${Math.floor(100000 + Math.random() * 900000)}`,
        services: [
          {
            id: `srv-${Date.now()}-1`,
            name: `Standard ${categoryMeta?.name || 'Trade'} Inspection & Service Call`,
            durationMinutes: 60,
            price: startingNum,
            pricingType: 'fixed',
            description: 'On-site technical evaluation, diagnostic testing, and immediate minor repair recommendations.'
          },
          {
            id: `srv-${Date.now()}-2`,
            name: `Comprehensive Project Assessment`,
            durationMinutes: 90,
            price: Math.round(startingNum * 1.5),
            pricingType: 'fixed',
            description: 'Full code-compliant inspection with itemized materials breakdown and written warranty.'
          }
        ],
        availability: [
          {
            dateString: new Date().toISOString().split('T')[0],
            dayLabel: 'Today',
            slots: [
              { time: '10:00 AM', available: true },
              { time: '01:30 PM', available: true },
              { time: '04:00 PM', available: true }
            ]
          },
          {
            dateString: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            dayLabel: 'Tomorrow',
            slots: [
              { time: '09:00 AM', available: true },
              { time: '11:30 AM', available: true },
              { time: '03:00 PM', available: true }
            ]
          }
        ],
        reviews: []
      };
    }

    const newUser: UserAccount = {
      id: userId,
      name: fullName,
      email: email.trim(),
      role: signupRole,
      avatar,
      phone: phone || '(555) 123-4567',
      address: signupRole === 'client' ? (address || '100 Neighborhood Way') : undefined,
      neighborhood,
      providerId: newProviderId,
      businessName: signupRole === 'provider' ? (businessName || `${fullName} Trade Works`) : undefined,
      tradeCategory: signupRole === 'provider' ? tradeCategory : undefined,
      licenseNumber: signupRole === 'provider' ? licenseNumber : undefined,
      startingPrice: signupRole === 'provider' ? parseFloat(startingPrice) : undefined,
      yearsExperience: signupRole === 'provider' ? parseInt(yearsExperience) : undefined,
      agencyDepartment: signupRole === 'civic_official' ? agencyDepartment : undefined,
      badgeId: signupRole === 'civic_official' ? badgeId : undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSignup(newUser, newProviderProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className="bg-slate-950 text-white px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">CivicGuild</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Universal Identity
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Secure access for Service Providers, Local Clients & Civic Authorities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Sign In vs Sign Up */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-colors border-b-2 ${
              mode === 'signin'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Sign In to Existing Account
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-colors border-b-2 ${
              mode === 'signup'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Create New Account (Traders & Clients)
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {mode === 'signin' ? (
            <div className="space-y-6">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. elena@voltaicsolar.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Account Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Persona Picker */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Instant Demo Login (Click to Sign In)
                  </span>
                  <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                    Pre-configured Roles
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {allUsers.map((u) => {
                    const isTrader = u.role === 'provider';
                    const isGov = u.role === 'civic_official';
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(u)}
                        className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all flex items-center gap-3 group"
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-indigo-500"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                              {u.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {isTrader ? (u.businessName || 'Service Provider') : isGov ? 'Civic Official' : 'Client / Homeowner'}
                          </p>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wide font-medium shrink-0 ${
                          isTrader 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : isGov 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}>
                          {isTrader ? 'Trader' : isGov ? 'Gov' : 'Client'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-5">
              {signupError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{signupError}</span>
                </div>
              )}

              {/* Step 1: Choose Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  1. Select Account Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Trader Option */}
                  <button
                    type="button"
                    onClick={() => setSignupRole('provider')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      signupRole === 'provider'
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      Trader & Pro
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      Electricians, beauty, plumbers, painters & maintenance pros.
                    </p>
                  </button>

                  {/* Client Option */}
                  <button
                    type="button"
                    onClick={() => setSignupRole('client')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      signupRole === 'client'
                        ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-2">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      Client / Resident
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      Discover services, book verified slots, and release escrow funds.
                    </p>
                  </button>

                  {/* Civic Officer Option */}
                  <button
                    type="button"
                    onClick={() => setSignupRole('civic_official')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      signupRole === 'civic_official'
                        ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-2">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      Civic / Govt Rep
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      Post public work tenders, evaluate contractor bids & verify badges.
                    </p>
                  </button>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {signupRole === 'provider' ? 'Full Name / Primary Contact' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Role-Specific Fields */}
              {signupRole === 'provider' && (
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Trader & Business Credentials</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Trade Specialty Category
                      </label>
                      <select
                        value={tradeCategory}
                        onChange={(e) => setTradeCategory(e.target.value as ServiceCategoryId)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="electrical">⚡ Electrical & Solar</option>
                        <option value="plumbing">🔧 Plumbing & Water</option>
                        <option value="beauty">💅 Beauty & Personal Care</option>
                        <option value="roofing">🏠 Roofing & Gutters</option>
                        <option value="painting">🎨 Painting & Surface Finishes</option>
                        <option value="landscaping">🌳 Landscaping & Grounds</option>
                        <option value="maintenance">🔨 Household Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Registered Business / Trading Name
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Miller Electrical Innovations"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        License or Trade Reg Number
                      </label>
                      <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="e.g. LIC-CA-889102"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Base Starting Rate ($)
                      </label>
                      <input
                        type="number"
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(e.target.value)}
                        placeholder="95"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {signupRole === 'client' && (
                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-800 dark:text-indigo-300">
                    <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Location for Service Dispatch</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Neighborhood
                      </label>
                      <select
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Old Town & East Ward">Old Town & East Ward</option>
                        <option value="Civic Center & Midtown">Civic Center & Midtown</option>
                        <option value="Highland Park & West">Highland Park & West</option>
                        <option value="Arts District & Central">Arts District & Central</option>
                        <option value="Industrial Harbor & South">Industrial Harbor & South</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Street Address (for technician visits)
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 742 Evergreen Terrace"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {signupRole === 'civic_official' && (
                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
                    <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Municipal Agency Verification</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Agency / City Department
                      </label>
                      <input
                        type="text"
                        value={agencyDepartment}
                        onChange={(e) => setAgencyDepartment(e.target.value)}
                        placeholder="e.g. Dept of Public Works"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Officer ID / Badge Number
                      </label>
                      <input
                        type="text"
                        value={badgeId}
                        onChange={(e) => setBadgeId(e.target.value)}
                        placeholder="e.g. GOV-VALLEY-901"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Terms */}
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400">
                  I agree to the CivicGuild verified credentials protocol, anti-fraud escrow rules, and municipal contracting standards.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Complete Registration & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
