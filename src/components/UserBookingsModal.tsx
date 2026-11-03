import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Printer, 
  X,
  MessageSquare
} from 'lucide-react';
import { Booking, Review } from '../types.ts';

interface UserBookingsModalProps {
  bookings: Booking[];
  onClose: () => void;
  onAddReview: (providerId: string, review: Review) => void;
  onConfirmJobComplete: (bookingId: string) => void;
}

export const UserBookingsModal: React.FC<UserBookingsModalProps> = ({
  bookings,
  onClose,
  onAddReview,
  onConfirmJobComplete,
}) => {
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewedBookings, setReviewedBookings] = useState<Record<string, boolean>>({});

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingBooking) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      authorName: reviewingBooking.clientName,
      authorLocation: 'Verified Resident',
      rating,
      date: 'Today',
      comment: reviewComment || 'Outstanding work! Very professional and clean.',
      verifiedHire: true,
      projectType: reviewingBooking.serviceName,
    };

    onAddReview(reviewingBooking.providerId, newReview);
    setReviewedBookings((prev) => ({ ...prev, [reviewingBooking.id]: true }));
    setReviewingBooking(null);
    setReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                My Appointments & Escrow Vault
              </h3>
              <p className="text-[11px] text-slate-500">
                Track appointments, manage escrow funds, and leave ratings
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {bookings.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              You haven't scheduled any appointments yet. Discover services on the catalog.
            </div>
          ) : (
            bookings.map((booking) => {
              const hasReviewed = reviewedBookings[booking.id] || booking.reviewed;
              return (
                <div
                  key={booking.id}
                  className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        #{booking.bookingRef}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {booking.providerBusiness}
                      </span>
                      <span className="text-slate-500">({booking.providerName})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-md">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Escrow Held: ${booking.totalAmount.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Service Ordered:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{booking.serviceName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Date & Time Slot:</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        {booking.dateString} at {booking.timeSlot}
                      </span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 block">Service Location:</span>
                      <span className="text-slate-900 dark:text-white">{booking.serviceAddress}</span>
                    </div>
                  </div>

                  {/* Actions strip: Print receipt, Complete/Release, Leave Review */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <button
                      onClick={() => window.print()}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-medium"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Official Voucher</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {booking.status === 'confirmed' ? (
                        <button
                          onClick={() => onConfirmJobComplete(booking.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Work Complete & Release Escrow</span>
                        </button>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Job Completed & Escrow Paid</span>
                        </span>
                      )}

                      {!hasReviewed ? (
                        <button
                          onClick={() => setReviewingBooking(booking)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>Leave Review</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          ✓ Review published
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Review Dialog */}
      {reviewingBooking && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Rate {reviewingBooking.providerBusiness}
            </h4>
            <p className="text-xs text-slate-500">
              Your feedback is displayed on the public registry as a verified hire.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono font-bold text-sm ml-2">{rating}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details on timeliness, skill, cleanliness, and communication..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingBooking(null)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
