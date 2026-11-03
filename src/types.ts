export type ServiceCategoryId = 
  | 'all'
  | 'beauty'
  | 'electrical'
  | 'plumbing'
  | 'landscaping'
  | 'painting'
  | 'roofing'
  | 'maintenance';

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  icon: string;
  description: string;
  typicalJobTurnaround: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  pricingType: 'fixed' | 'hourly_starts_at' | 'estimate_required';
  description: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorLocation: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedHire: boolean;
  projectType: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DayAvailability {
  dateString: string; // YYYY-MM-DD
  dayLabel: string;   // "Mon, Nov 3"
  slots: TimeSlot[];
}

export interface VerificationDocument {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  previewUrl?: string;
}

export interface VerificationRequest {
  id: string;
  providerId: string;
  licenseNumber: string;
  issuingAuthority: string;
  licenseExpiry: string;
  insurancePolicyNumber: string;
  insuranceCarrier: string;
  coverageAmount: string;
  licenseDoc?: VerificationDocument;
  insuranceDoc?: VerificationDocument;
  requestedBadges: Array<'Licensed & Insured' | 'City Vetted' | 'Government Approved Contractor'>;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  businessName: string;
  headline: string;
  avatar: string;
  coverImage: string;
  category: ServiceCategoryId;
  specialties: string[];
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  hourlyRate?: number;
  startingPrice: number;
  location: {
    neighborhood: string;
    city: string;
    distanceMiles: number;
    servicingRadiusMiles: number;
  };
  badges: Array<'Licensed & Insured' | 'City Vetted' | 'Master Artisan' | 'Eco-Certified' | 'Government Approved Contractor'>;
  yearsInBusiness: number;
  responseTimeMinutes: number;
  bio: string;
  services: ServiceItem[];
  availability: DayAvailability[];
  reviews: Review[];
  insurancePolicyNumber?: string;
  licenseNumber?: string;
  verificationRequest?: VerificationRequest;
}

export type PaymentMethodType = 'credit_card' | 'apple_pay' | 'escrow_hold' | 'civic_po';

export interface Booking {
  id: string;
  bookingRef: string;
  providerId: string;
  providerName: string;
  providerBusiness: string;
  providerAvatar: string;
  category: ServiceCategoryId;
  serviceId: string;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceAddress: string;
  dateString: string;
  timeSlot: string;
  notes?: string;
  basePrice: number;
  serviceFee: number;
  protectionFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'paid' | 'escrow_secured' | 'po_pending';
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  reviewed?: boolean;
}

export interface BidSubmission {
  id: string;
  providerId: string;
  providerName: string;
  providerBusiness: string;
  providerAvatar: string;
  proposedBudget: number;
  estimatedTimelineDays: number;
  coverLetter: string;
  licenseVerified: boolean;
  submittedAt: string;
  status: 'pending' | 'shortlisted' | 'awarded' | 'declined';
}

export interface CivicProject {
  id: string;
  projectCode: string;
  title: string;
  department: string;
  neighborhood: string;
  category: ServiceCategoryId;
  targetBudget: number;
  deadlineDate: string;
  completionTargetDate: string;
  description: string;
  scopePoints: string[];
  requiredCredentials: string[];
  image: string;
  status: 'open_for_bids' | 'under_review' | 'awarded' | 'completed';
  bids: BidSubmission[];
  featuredCitizenBenefit: string;
}
