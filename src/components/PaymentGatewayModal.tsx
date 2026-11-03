import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Printer, 
  Calendar, 
  MapPin, 
  Clock, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { ServiceProvider, ServiceItem, Booking, PaymentMethodType, UserAccount } from '../types.ts';

interface PaymentGatewayModalProps {
  provider: ServiceProvider;
  service: ServiceItem;
  dateString: string;
  timeSlot: string;
  currentUser?: UserAccount | null;
  onClose: () => void;
  onPaymentSuccess: (booking: Booking) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  provider,
  service,
  dateString,
  timeSlot,
  currentUser,
  onClose,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit_card');
  const [clientName, setClientName] = useState(currentUser?.name || 'Sarah Jenkins');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || 'sarah.jenkins@example.com');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '(555) 789-2041');
  const [serviceAddress, setServiceAddress] = useState(currentUser?.address || '458 Maple Ave, Metro Valley');
  const [specialNotes, setSpecialNotes] = useState('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('892');
  const [civicPoNumber, setCivicPoNumber] = useState('MUNI-PO-2026-9941');

  // Checkout submission states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('Initializing secure SSL handshake...');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const basePrice = service.price;
  const escrowFee = 4.50;
  const serviceFee = Number((basePrice * 0.05).toFixed(2));
  const totalAmount = Number((basePrice + escrowFee + serviceFee).toFixed(2));

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const stages = [
      'Establishing 256-bit TLS secure channel...',
      'Validating payment method authorization...',
      'Locking funds into CivicGuild Escrow Trust...',
      'Securing appointment on provider schedule...',
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < stages.length) {
        setProcessingStage(stages[step]);
      } else {
        clearInterval(interval);
        const bookingRef = `CG-${Math.floor(10000 + Math.random() * 90000)}`;
        const newBooking: Booking = {
          id: `bk-${Date.now()}`,
          bookingRef,
          providerId: provider.id,
          providerName: provider.name,
          providerBusiness: provider.businessName,
          providerAvatar: provider.avatar,
          category: provider.category,
          serviceId: service.id,
          serviceName: service.name,
          clientName,
          clientEmail,
          clientPhone,
          serviceAddress,
          dateString,
          timeSlot,
          notes: specialNotes,
          basePrice,
          serviceFee,
          protectionFee: escrowFee,
          totalAmount,
          paymentMethod,
          paymentStatus: paymentMethod === 'civic_po' ? 'po_pending' : 'escrow_secured',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };

        setIsProcessing(false);
        setConfirmedBooking(newBooking);
        onPaymentSuccess(newBooking);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                CivicGuild Secure Gateway
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                End-to-End Escrow Protection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto">
          {/* Confirmed State */}
          {confirmedBooking ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Appointment Confirmed & Escrow Held
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Booking Reference <strong className="font-mono text-indigo-600 dark:text-indigo-400">#{confirmedBooking.bookingRef}</strong>
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{confirmedBooking.serviceName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Provider:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{confirmedBooking.providerBusiness}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Scheduled Time:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">{confirmedBooking.dateString} at {confirmedBooking.timeSlot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-900 dark:text-white truncate max-w-[280px]">{confirmedBooking.serviceAddress}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 text-sm font-bold">
                  <span>Total Escrow Amount:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">${confirmedBooking.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-left text-[11px] text-indigo-900 dark:text-indigo-300">
                <strong>What happens next:</strong> {confirmedBooking.providerName} has received your booking details and will arrive at the scheduled time. You can view the status or release funds anytime in "My Appointments".
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            /* Processing Animation State */
            <div className="py-14 text-center space-y-5">
              <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Securing Transaction
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  {processingStage}
                </p>
              </div>
            </div>
          ) : (
            /* Interactive Payment Form */
            <form onSubmit={handleProcessPayment} className="space-y-6">
              {/* Order quick pill */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    {service.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {dateString} · {timeSlot} · {provider.businessName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                    ${totalAmount.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                    Escrow Bonded
                  </span>
                </div>
              </div>

              {/* Client Contact & Service Location */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Service Address & Contact
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 mb-1">Service Address / Job Site</label>
                    <input
                      type="text"
                      required
                      value={serviceAddress}
                      onChange={(e) => setServiceAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-500 mb-1">Entry Instructions or Special Notes (Optional)</label>
                    <input
                      type="text"
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="E.g. Ring side doorbell, park in front driveway..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Secure Gateway Method
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-xl border text-center font-medium transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-slate-700 dark:text-slate-200" />
                    <span>Credit / Debit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded-xl border text-center font-medium transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold text-sm block mb-0.5">Pay</span>
                    <span>Apple / Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('escrow_hold')}
                    className={`p-3 rounded-xl border text-center font-medium transition-all ${
                      paymentMethod === 'escrow_hold'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                    <span>Escrow Direct</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('civic_po')}
                    className={`p-3 rounded-xl border text-center font-medium transition-all ${
                      paymentMethod === 'civic_po'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                    <span>Civic / PO</span>
                  </button>
                </div>

                {/* Sub-fields for Card */}
                {paymentMethod === 'credit_card' && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 mb-1">Expires (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-1">CVC Code</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-fields for Civic PO */}
                {paymentMethod === 'civic_po' && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 space-y-2 text-xs">
                    <label className="block text-amber-900 dark:text-amber-200 font-medium">
                      Municipal / Organization Purchase Order Number
                    </label>
                    <input
                      type="text"
                      value={civicPoNumber}
                      onChange={(e) => setCivicPoNumber(e.target.value)}
                      className="w-full px-3 py-2 font-mono rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <p className="text-[11px] text-amber-800 dark:text-amber-300">
                      Invoicing terms Net-30 subject to city procurement verification.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Authorize & Secure ${totalAmount.toFixed(2)} in Escrow</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mt-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-Bit Encrypted Gateway · Zero Risk Escrow Protection</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
