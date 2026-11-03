/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { CategoryNav } from './components/CategoryNav.tsx';
import { ProviderCard } from './components/ProviderCard.tsx';
import { ProviderDetailModal } from './components/ProviderDetailModal.tsx';
import { PaymentGatewayModal } from './components/PaymentGatewayModal.tsx';
import { CivicProjectsSection } from './components/CivicProjectsSection.tsx';
import { ProviderDashboardModal } from './components/ProviderDashboardModal.tsx';
import { UserBookingsModal } from './components/UserBookingsModal.tsx';
import { PostCivicProjectModal } from './components/PostCivicProjectModal.tsx';
import { HowItWorksView } from './components/HowItWorksView.tsx';
import { SavedProvidersView } from './components/SavedProvidersView.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Footer } from './components/Footer.tsx';

import { 
  ServiceProvider, 
  ServiceCategoryId, 
  ServiceItem, 
  Booking, 
  CivicProject, 
  BidSubmission, 
  Review,
  VerificationRequest,
  UserAccount,
  UserRole
} from './types.ts';

import { 
  INITIAL_PROVIDERS, 
  INITIAL_CIVIC_PROJECTS, 
  INITIAL_BOOKINGS, 
  SERVICE_CATEGORIES 
} from './data/mockData.ts';

import { INITIAL_USERS } from './data/mockUsers.ts';

import { 
  Filter, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  Search,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Core Data Collections
  const [providers, setProviders] = useState<ServiceProvider[]>(() => {
    const saved = localStorage.getItem('civicguild_providers');
    return saved ? JSON.parse(saved) : INITIAL_PROVIDERS;
  });

  const [civicProjects, setCivicProjects] = useState<CivicProject[]>(() => {
    const saved = localStorage.getItem('civicguild_civic_projects');
    return saved ? JSON.parse(saved) : INITIAL_CIVIC_PROJECTS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('civicguild_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('civicguild_providers', JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem('civicguild_civic_projects', JSON.stringify(civicProjects));
  }, [civicProjects]);

  useEffect(() => {
    localStorage.setItem('civicguild_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // User Accounts & Authentication State
  const [allUsers, setAllUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('civicguild_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('civicguild_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Elena Rostova (Master Electrician)
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    localStorage.setItem('civicguild_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('civicguild_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('civicguild_current_user');
    }
  }, [currentUser]);

  // Navigation & Filter state
  const [currentTab, setCurrentTab] = useState<'browse' | 'saved' | 'civic' | 'how_it_works' | 'my_bookings'>('browse');
  const [isProviderMode, setIsProviderMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('any');
  const [verifiedOnlyFilter, setVerifiedOnlyFilter] = useState<boolean>(false);

  // Saved Providers (Persistent via localStorage)
  const [savedProviderIds, setSavedProviderIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('civicguild_saved_providers');
    return saved ? JSON.parse(saved) : ['pro-voltaic', 'pro-aura'];
  });

  useEffect(() => {
    localStorage.setItem('civicguild_saved_providers', JSON.stringify(savedProviderIds));
  }, [savedProviderIds]);

  const toggleSaveProvider = (providerId: string) => {
    setSavedProviderIds((prev) => {
      const isCurrentlySaved = prev.includes(providerId);
      const updated = isCurrentlySaved
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId];

      const pro = providers.find((p) => p.id === providerId);
      const name = pro ? pro.businessName : 'Provider';
      setBookingToast(
        isCurrentlySaved
          ? `${name} removed from saved`
          : `${name} saved to your shortlist!`
      );
      setTimeout(() => setBookingToast(null), 3000);
      return updated;
    });
  };

  const handleClearAllSaved = () => {
    setSavedProviderIds([]);
    setBookingToast('Saved shortlist cleared');
    setTimeout(() => setBookingToast(null), 3000);
  };

  const savedProviders = useMemo(() => {
    return providers.filter((p) => savedProviderIds.includes(p.id));
  }, [providers, savedProviderIds]);

  // Modals & Interaction States
  const [activeDetailProvider, setActiveDetailProvider] = useState<ServiceProvider | null>(null);
  const [preselectedDate, setPreselectedDate] = useState<string | undefined>(undefined);
  const [preselectedSlot, setPreselectedSlot] = useState<string | undefined>(undefined);

  const [checkoutSession, setCheckoutSession] = useState<{
    provider: ServiceProvider;
    service: ServiceItem;
    dateString: string;
    timeSlot: string;
  } | null>(null);

  const [isPostProjectModalOpen, setIsPostProjectModalOpen] = useState<boolean>(false);
  const [bookingToast, setBookingToast] = useState<string | null>(null);

  // Category counts
  const countsByCategory = useMemo(() => {
    const counts: Record<ServiceCategoryId, number> = {
      all: providers.length,
      beauty: 0,
      electrical: 0,
      plumbing: 0,
      landscaping: 0,
      painting: 0,
      roofing: 0,
      maintenance: 0,
    };

    providers.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category] += 1;
      }
    });

    return counts;
  }, [providers]);

  // Filtered providers
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Neighborhood filter
      if (selectedNeighborhood !== 'all' && p.location.neighborhood !== selectedNeighborhood) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBusiness = p.businessName.toLowerCase().includes(q);
        const matchesHeadline = p.headline.toLowerCase().includes(q);
        const matchesSpecialties = p.specialties.some((s) => s.toLowerCase().includes(q));
        const matchesServices = p.services.some((s) => s.name.toLowerCase().includes(q));
        if (!matchesName && !matchesBusiness && !matchesHeadline && !matchesSpecialties && !matchesServices) {
          return false;
        }
      }

      // Verified badges filter
      if (verifiedOnlyFilter && !p.badges.includes('Licensed & Insured')) {
        return false;
      }

      // Real-time Availability filter
      if (availabilityFilter === 'today') {
        const todayDay = p.availability[0];
        if (!todayDay || !todayDay.slots.some((s) => s.available)) return false;
      } else if (availabilityFilter === 'tomorrow') {
        const tomorrowDay = p.availability[1];
        if (!tomorrowDay || !tomorrowDay.slots.some((s) => s.available)) return false;
      } else if (availabilityFilter === 'week') {
        const hasAnySlot = p.availability.some((d) => d.slots.some((s) => s.available));
        if (!hasAnySlot) return false;
      }

      return true;
    });
  }, [providers, selectedCategory, selectedNeighborhood, searchQuery, verifiedOnlyFilter, availabilityFilter]);

  // Handler: direct book slot from card
  const handleDirectBookSlot = (provider: ServiceProvider, dateString: string, timeSlot: string) => {
    setActiveDetailProvider(provider);
    setPreselectedDate(dateString);
    setPreselectedSlot(timeSlot);
  };

  // Handler: proceed to payment gateway
  const handleProceedToPayment = (
    provider: ServiceProvider,
    service: ServiceItem,
    dateString: string,
    timeSlot: string
  ) => {
    setActiveDetailProvider(null);
    setCheckoutSession({ provider, service, dateString, timeSlot });
  };

  // Handler: on payment success
  const handlePaymentSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Mark slot as booked on provider
    setProviders((prev) =>
      prev.map((pro) => {
        if (pro.id !== newBooking.providerId) return pro;
        return {
          ...pro,
          completedJobsCount: pro.completedJobsCount + 1,
          availability: pro.availability.map((day) => {
            if (day.dateString !== newBooking.dateString) return day;
            return {
              ...day,
              slots: day.slots.map((slot) => {
                if (slot.time === newBooking.timeSlot) {
                  return { ...slot, available: false };
                }
                return slot;
              }),
            };
          }),
        };
      })
    );

    setBookingToast(`Appointment confirmed! Booking Reference #${newBooking.bookingRef}`);
    setTimeout(() => setBookingToast(null), 5000);
  };

  // Handler: provider updates booking status (e.g. marked complete)
  const handleUpdateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  // Handler: client confirms complete & releases escrow
  const handleConfirmJobComplete = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'completed', paymentStatus: 'paid' }
          : b
      )
    );
    setBookingToast('Escrow funds released to service provider! Thank you.');
    setTimeout(() => setBookingToast(null), 4000);
  };

  // Handler: add review
  const handleAddReview = (providerId: string, newReview: Review) => {
    setProviders((prev) =>
      prev.map((pro) => {
        if (pro.id !== providerId) return pro;
        const newReviews = [newReview, ...pro.reviews];
        const newAvg =
          newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return {
          ...pro,
          reviews: newReviews,
          reviewCount: pro.reviewCount + 1,
          rating: Number(newAvg.toFixed(2)),
        };
      })
    );
    setBookingToast('Review verified and published to provider profile!');
    setTimeout(() => setBookingToast(null), 4000);
  };

  // Handler: add service from provider console
  const handleAddService = (providerId: string, service: ServiceItem) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id !== providerId) return p;
        return {
          ...p,
          services: [...p.services, service],
        };
      })
    );
  };

  // Handler: toggle slot availability
  const handleToggleSlot = (providerId: string, dateString: string, timeSlot: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id !== providerId) return p;
        return {
          ...p,
          availability: p.availability.map((day) => {
            if (day.dateString !== dateString) return day;
            return {
              ...day,
              slots: day.slots.map((s) => {
                if (s.time === timeSlot) {
                  return { ...s, available: !s.available };
                }
                return s;
              }),
            };
          }),
        };
      })
    );
  };

  // Handler: submit bid on civic project
  const handleSubmitBid = (projectId: string, bid: BidSubmission) => {
    setCivicProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          bids: [bid, ...proj.bids],
        };
      })
    );
  };

  const [selectedProviderIdForConsole, setSelectedProviderIdForConsole] = useState<string>('pro-voltaic');

  // Handler: submit verification request for badges
  const handleVerificationSubmit = (providerId: string, verification: VerificationRequest) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id !== providerId) return p;

        // Combine requested badges with existing ones uniquely
        const mergedBadges = Array.from(
          new Set([...p.badges, ...verification.requestedBadges])
        ) as ServiceProvider['badges'];

        return {
          ...p,
          licenseNumber: verification.licenseNumber,
          insurancePolicyNumber: verification.insurancePolicyNumber,
          badges: mergedBadges,
          verificationRequest: verification,
        };
      })
    );

    setBookingToast(`Verification approved! Badges minted for ${verification.licenseNumber}`);
    setTimeout(() => setBookingToast(null), 5000);
  };

  // Handler: post new civic RFQ
  const handleCreateCivicProject = (newProject: CivicProject) => {
    setCivicProjects((prev) => [newProject, ...prev]);
    setBookingToast(`Community Tender ${newProject.projectCode} published!`);
    setTimeout(() => setBookingToast(null), 4000);
  };

  // Auth Handlers
  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'provider' && user.providerId) {
      setSelectedProviderIdForConsole(user.providerId);
    }
    const roleLabel = user.role === 'provider' ? 'Trader Pro' : user.role === 'civic_official' ? 'Civic Official' : 'Client';
    setBookingToast(`Welcome back, ${user.name}! (${roleLabel})`);
    setTimeout(() => setBookingToast(null), 4000);
  };

  const handleSignup = (newUser: UserAccount, newProvider?: ServiceProvider) => {
    setAllUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    if (newProvider) {
      setProviders((prev) => [newProvider, ...prev]);
      setSelectedProviderIdForConsole(newProvider.id);
      setIsProviderMode(true);
    }

    const roleLabel = newUser.role === 'provider' ? 'Trader Pro' : newUser.role === 'civic_official' ? 'Civic Official' : 'Client';
    setBookingToast(`Account created! Signed in as ${newUser.name} (${roleLabel})`);
    setTimeout(() => setBookingToast(null), 4000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsProviderMode(false);
    setBookingToast('You have been signed out of CivicGuild.');
    setTimeout(() => setBookingToast(null), 3500);
  };

  const handleSwitchUser = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'provider' && user.providerId) {
      setSelectedProviderIdForConsole(user.providerId);
    }
    const roleLabel = user.role === 'provider' ? 'Trader Pro' : user.role === 'civic_official' ? 'Civic Official' : 'Client';
    setBookingToast(`Active Account: ${user.name} (${roleLabel})`);
    setTimeout(() => setBookingToast(null), 3500);
  };

  const handleOpenProviderDashboard = (providerId?: string) => {
    if (providerId) {
      setSelectedProviderIdForConsole(providerId);
    }
    setIsProviderMode(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isProviderMode={isProviderMode}
        setIsProviderMode={setIsProviderMode}
        openNewProjectModal={() => {
          if (currentUser?.role === 'civic_official' || !isProviderMode) {
            setIsPostProjectModalOpen(true);
          } else {
            // Open provider console directly
            setIsProviderMode(true);
          }
        }}
        bookingCount={bookings.length}
        savedCount={savedProviderIds.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        onOpenAuthModal={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        allUsers={allUsers}
        openProviderDashboard={handleOpenProviderDashboard}
      />

      {/* Global Toast Alert */}
      {bookingToast && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl shadow-xl border border-slate-700 dark:border-slate-200 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span className="font-medium">{bookingToast}</span>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'browse' && (
          <>
            {/* Hero Section */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedNeighborhood={selectedNeighborhood}
              setSelectedNeighborhood={setSelectedNeighborhood}
              availabilityFilter={availabilityFilter}
              setAvailabilityFilter={setAvailabilityFilter}
              onExploreCivic={() => setCurrentTab('civic')}
              currentUser={currentUser}
              onOpenAuthModal={(mode) => {
                setAuthModalMode(mode);
                setIsAuthModalOpen(true);
              }}
            />

            {/* Category Segmented Strip */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              countsByCategory={countsByCategory}
            />

            {/* Marketplace Catalog Section */}
            <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Filter controls row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {selectedCategory === 'all'
                      ? 'Verified Local Specialists & Contractors'
                      : SERVICE_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Showing {filteredProviders.length} available service providers with real-time schedule slots
                  </p>
                </div>

                {/* Filter toggles */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setVerifiedOnlyFilter(!verifiedOnlyFilter)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                      verifiedOnlyFilter
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
                    <span>State Licensed Only</span>
                  </button>

                  {(searchQuery || selectedCategory !== 'all' || selectedNeighborhood !== 'all' || availabilityFilter !== 'any') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedNeighborhood('all');
                        setAvailabilityFilter('any');
                        setVerifiedOnlyFilter(false);
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {/* Providers Grid */}
              {filteredProviders.length === 0 ? (
                <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                  <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    No professionals found matching your search
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Try clearing filters or search for another trade like beauty, electrician, plumbing, landscaping, painter, or roof repair.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedNeighborhood('all');
                      setAvailabilityFilter('any');
                    }}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filteredProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      isSaved={savedProviderIds.includes(provider.id)}
                      onToggleSave={toggleSaveProvider}
                      onSelect={(p) => {
                        setActiveDetailProvider(p);
                        setPreselectedDate(undefined);
                        setPreselectedSlot(undefined);
                      }}
                      onBookSlot={handleDirectBookSlot}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Neighborhood Civic Banner Teaser */}
            <section className="bg-slate-900 text-white py-12 border-t border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="max-w-2xl">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Neighborhood Economic Resilience
                    </span>
                    <h3 className="text-2xl font-bold mt-1 tracking-tight [text-wrap:balance]">
                      Are you a municipal officer or neighborhood association leader?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Publish public tenders for community parks, historical facade painting, senior living ramps, and lighting projects. Ensure municipal funds employ verified neighborhood talent.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setCurrentTab('civic')}
                      className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs rounded-xl transition-colors shadow-sm"
                    >
                      View Active Civic Tenders
                    </button>
                    <button
                      onClick={() => setIsPostProjectModalOpen(true)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
                    >
                      Post New Community RFQ
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentTab === 'saved' && (
          <SavedProvidersView
            savedProviders={savedProviders}
            onSelectProvider={(p) => {
              setActiveDetailProvider(p);
              setPreselectedDate(undefined);
              setPreselectedSlot(undefined);
            }}
            onBookSlot={handleDirectBookSlot}
            onToggleSave={toggleSaveProvider}
            onBrowseServices={() => setCurrentTab('browse')}
            onClearAllSaved={handleClearAllSaved}
          />
        )}

        {currentTab === 'civic' && (
          <CivicProjectsSection
            projects={civicProjects}
            providers={providers}
            currentUser={currentUser}
            onOpenNewProject={() => setIsPostProjectModalOpen(true)}
            onSubmitBid={handleSubmitBid}
            onOpenAuthModal={(mode) => {
              setAuthModalMode(mode);
              setIsAuthModalOpen(true);
            }}
          />
        )}

        {currentTab === 'how_it_works' && (
          <HowItWorksView
            onStartBrowsing={() => setCurrentTab('browse')}
            onExploreTenders={() => setCurrentTab('civic')}
          />
        )}

        {currentTab === 'my_bookings' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <UserBookingsModal
              bookings={bookings}
              onClose={() => setCurrentTab('browse')}
              onAddReview={handleAddReview}
              onConfirmJobComplete={handleConfirmJobComplete}
            />
          </div>
        )}
      </main>

      {/* Provider Console Modal (When Provider Mode is enabled or triggered) */}
      {isProviderMode && (
        <ProviderDashboardModal
          provider={providers.find((p) => p.id === selectedProviderIdForConsole) || providers[0]}
          bookings={bookings}
          onClose={() => setIsProviderMode(false)}
          onUpdateBookingStatus={handleUpdateBookingStatus}
          onAddService={handleAddService}
          onToggleSlot={handleToggleSlot}
          onSubmitVerification={handleVerificationSubmit}
        />
      )}

      {/* Provider Details & Real-Time Booking Modal */}
      {activeDetailProvider && (
        <ProviderDetailModal
          provider={activeDetailProvider}
          initialDate={preselectedDate}
          initialSlot={preselectedSlot}
          onClose={() => {
            setActiveDetailProvider(null);
            setPreselectedDate(undefined);
            setPreselectedSlot(undefined);
          }}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {/* Secure Payment Gateway Modal */}
      {checkoutSession && (
        <PaymentGatewayModal
          provider={checkoutSession.provider}
          service={checkoutSession.service}
          dateString={checkoutSession.dateString}
          timeSlot={checkoutSession.timeSlot}
          currentUser={currentUser}
          onClose={() => setCheckoutSession(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Post Civic Project Modal */}
      {isPostProjectModalOpen && (
        <PostCivicProjectModal
          onClose={() => setIsPostProjectModalOpen(false)}
          onProjectCreated={handleCreateCivicProject}
        />
      )}

      {/* Universal Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        allUsers={allUsers}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentTab('browse');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onOpenCivic={() => {
          setCurrentTab('civic');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHowItWorks={() => {
          setCurrentTab('how_it_works');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSaved={() => {
          setCurrentTab('saved');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
