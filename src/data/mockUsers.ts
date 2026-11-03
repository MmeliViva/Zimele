import { UserAccount } from '../types.ts';

export const INITIAL_USERS: UserAccount[] = [
  // Traders / Service Providers
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    email: 'elena@voltaicsolar.com',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    phone: '(555) 349-8821',
    providerId: 'pro-voltaic',
    businessName: 'Voltaic & Solar Craft Services',
    tradeCategory: 'electrical',
    licenseNumber: 'EL-CA-993821-M',
    startingPrice: 110,
    yearsExperience: 12,
    neighborhood: 'Old Town & East Ward',
    createdAt: '2025-01-15'
  },
  {
    id: 'user-marcus',
    name: 'Marcus Rivera',
    email: 'marcus@precisionhydro.com',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    phone: '(555) 781-9940',
    providerId: 'pro-hydro',
    businessName: 'Precision Hydro & Flow Services',
    tradeCategory: 'plumbing',
    licenseNumber: 'PL-CA-449102-M',
    startingPrice: 125,
    yearsExperience: 15,
    neighborhood: 'Industrial Harbor & South',
    createdAt: '2025-02-01'
  },
  {
    id: 'user-amara',
    name: 'Amara Vance',
    email: 'amara@auracrown.com',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    phone: '(555) 234-5512',
    providerId: 'pro-aura',
    businessName: 'Aura & Crown Studio',
    tradeCategory: 'beauty',
    licenseNumber: 'COS-METRO-88210',
    startingPrice: 85,
    yearsExperience: 8,
    neighborhood: 'Arts District & Central',
    createdAt: '2025-02-10'
  },
  {
    id: 'user-david-chen',
    name: 'David Chen',
    email: 'david@apexweathershield.com',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    phone: '(555) 890-4421',
    providerId: 'pro-apex',
    businessName: 'Apex WeatherShield Roofing & Siding',
    tradeCategory: 'roofing',
    licenseNumber: 'ROOF-GEN-99410',
    startingPrice: 150,
    yearsExperience: 16,
    neighborhood: 'Highland Park & West',
    createdAt: '2025-01-20'
  },

  // Clients / People who want services
  {
    id: 'user-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    phone: '(555) 789-2041',
    address: '458 Maple Ave, Metro Valley',
    neighborhood: 'Old Town & East Ward',
    createdAt: '2025-03-01'
  },
  {
    id: 'user-liam',
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@example.com',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    phone: '(555) 412-9032',
    address: '88 Pine Ridge Blvd, Apt 3A',
    neighborhood: 'Civic Center & Midtown',
    createdAt: '2025-03-05'
  },

  // Civic / Municipal Officials
  {
    id: 'user-sterling',
    name: 'David K. Sterling',
    email: 'd.sterling@metrovalley.gov',
    role: 'civic_official',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    phone: '(555) 800-4321',
    agencyDepartment: 'Dept of Public Works & Civic Infrastructure',
    badgeId: 'GOV-INSP-8821',
    address: '100 Municipal Plaza, Suite 400',
    neighborhood: 'Civic Center & Midtown',
    createdAt: '2024-11-10'
  }
];
