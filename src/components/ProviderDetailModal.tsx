import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Award, 
  FileCheck, 
  Phone, 
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ServiceProvider, ServiceItem } from '../types.ts';

interface ProviderDetailModalProps {
  provider: ServiceProvider;
  onClose: () => void;
  onProceedToPayment: (
    provider: ServiceProvider,
    service: ServiceItem,
    dateString: string,
    timeSlot: string
  ) => void;
  initialDate?: string;
  initialSlot?: string;
}

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({
  provider,
  onClose,
  onProceedToPayment,
  initialDate,
  initialSlot,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem>(
    provider.services[0]
  );
  
  // Date selection state
  const defaultDate = initialDate || provider.availability[0]?.dateString || '';
  const [selectedDate, setSelectedDate] = useState<string>(defaultDate);

  const activeDay = provider.availability.find((d) => d.dateString === selectedDate) || provider.availability[0];

  // Time slot selection
  const defaultSlot = initialSlot || activeDay?.slots.find((s) => s.available)?.time || '';
  const [selectedSlot, setSelectedSlot] = useState<string>(defaultSlot);

  // Escrow breakdown calculations
  const basePrice = selectedService.price;
  const escrowFee = 4.50;
  const serviceFee = Number((basePrice * 0.05).toFixed(2));
  const totalDue = Number((basePrice + escrowFee + serviceFee).toFixed(2));

  const handleBookNow = () => {
    if (!selectedSlot) {
      alert('Please select an available time slot.');
      return;
    }
    onProceedToPayment(provider, selectedService, selectedDate, selectedSlot);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar with Close */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">
              Verified Professional Profile
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              License verified #{provider.licenseNumber || 'REG-2026'}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Hero Banner & Identity */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[21/9] sm:aspect-[24/9]">
            <img
              src={provider.coverImage}
              alt={provider.businessName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div className="flex items-center gap-4">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl border-2 border-white/80 object-cover shadow-md bg-slate-800"
                />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {provider.businessName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    Led by {provider.name} · {provider.yearsInBusiness} Years Active Experience
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <strong className="font-mono">{provider.rating.toFixed(2)}</strong> ({provider.reviewCount} reviews)
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {provider.location.neighborhood} ({provider.location.servicingRadiusMiles} mi radius)
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges strip */}
              <div className="flex flex-wrap gap-1.5">
                {provider.badges.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md text-slate-100 border border-white/10"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Layout: Left Details, Right Purchase Module */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Bio, Services Selection, Schedule & Reviews */}
            <div className="lg:col-span-7 space-y-7">
              {/* Bio & Credentials */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  About The Specialist
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {provider.bio}
                </p>

                {/* Verification Box */}
                <div className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">State/Trade License:</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      {provider.licenseNumber || 'Active Municipal License'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Insurance & Bonding:</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-white">
                      {provider.insurancePolicyNumber || '$1,000,000 General Liability'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Selection Module */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                    Select Service Package
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Transparent, fixed rates
                  </span>
                </div>

                <div className="space-y-2.5">
                  {provider.services.map((service) => {
                    const isSelected = selectedService.id === service.id;
                    return (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-50/60 border-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-sm'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600'
                              }`}>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {service.name}
                              </h4>
                            </div>
                            <p className="mt-1 ml-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              {service.description}
                            </p>
                            <span className="mt-2 ml-6 inline-block text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              Estimated duration: {service.durationMinutes} minutes
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                              ${service.price}
                            </span>
                            <span className="text-[11px] block text-slate-500 dark:text-slate-400 font-normal">
                              guaranteed price
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Schedule & Slots */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Real-Time Available Appointments
                </h3>

                {/* Day selector tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-3">
                  {provider.availability.map((day) => {
                    const isSelected = selectedDate === day.dateString;
                    const availableSlotsCount = day.slots.filter((s) => s.available).length;

                    return (
                      <button
                        key={day.dateString}
                        onClick={() => {
                          setSelectedDate(day.dateString);
                          const firstAvail = day.slots.find((s) => s.available)?.time;
                          if (firstAvail) setSelectedSlot(firstAvail);
                        }}
                        className={`px-3 py-2 text-xs font-medium rounded-xl border text-center whitespace-nowrap shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block font-semibold">{day.dayLabel}</span>
                        <span className={`text-[10px] block ${isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400'}`}>
                          {availableSlotsCount} open slots
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Available time pills */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {activeDay?.slots.map((slot, idx) => {
                    const isSelected = selectedSlot === slot.time;
                    return (
                      <button
                        key={idx}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`py-2 px-3 text-xs font-mono font-medium rounded-lg border text-center transition-all ${
                          !slot.available
                            ? 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800/40 dark:text-slate-600 dark:border-slate-800 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-300 dark:ring-indigo-900'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50/30'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verified Client Reviews */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                    Verified Client Reviews ({provider.reviewCount})
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-mono tabular-nums text-slate-900 dark:text-white">
                      {provider.rating.toFixed(2)} rating
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {provider.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {rev.authorName}
                          </span>
                          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                          <span className="text-slate-500 dark:text-slate-400">{rev.authorLocation}</span>
                          {rev.verifiedHire && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified Hire</span>
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400">{rev.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        "{rev.comment}"
                      </p>
                      <div className="mt-2 text-[11px] text-slate-400 font-mono">
                        Service: {rev.projectType}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 cols: Contiguous Sticky Purchase & Escrow Module */}
            <div className="lg:col-span-5 lg:sticky lg:top-20">
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                    Booking Summary
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedService.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    With {provider.businessName}
                  </p>
                </div>

                {/* Selected Slot Highlight */}
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{activeDay?.dayLabel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Time:</span>
                    <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{selectedSlot || 'Select a slot'}</span>
                  </div>
                </div>

                {/* Itemized Price Breakdown */}
                <div className="space-y-2 text-xs border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Base Service Rate</span>
                    <span className="font-mono tabular-nums font-semibold">${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-indigo-500" />
                      <span>Civic Escrow Trust Protection</span>
                    </span>
                    <span className="font-mono tabular-nums font-semibold">${escrowFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Platform Coordination</span>
                    <span className="font-mono tabular-nums font-semibold">${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-2">
                    <span>Total Amount (Escrow Held)</span>
                    <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                      ${totalDue.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Escrow Guarantee Callout */}
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 leading-snug">
                  <div className="flex items-center gap-1.5 font-bold mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>CivicGuild Escrow Guarantee</span>
                  </div>
                  Funds are secured in a trust account. The provider is paid only after you inspect and confirm the job is finished.
                </div>

                {/* Primary Booking Action */}
                <button
                  onClick={handleBookNow}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-indigo-500/20"
                >
                  <Lock className="w-4 h-4" />
                  <span>Reserve Appointment & Proceed to Payment</span>
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Free cancellation up to 24 hours prior to appointment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
