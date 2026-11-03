import { ServiceCategory, ServiceProvider, CivicProject, Booking } from '../types.ts';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'all',
    name: 'All Trades & Services',
    icon: 'Layers',
    description: 'Explore full verified directory of licensed technicians and artisans.',
    typicalJobTurnaround: 'Same day to 72h'
  },
  {
    id: 'beauty',
    name: 'Beauty & Personal Care',
    icon: 'Sparkles',
    description: 'Licensed hairstylists, nail artists, estheticians & barber professionals.',
    typicalJobTurnaround: '1 - 2 hours'
  },
  {
    id: 'electrical',
    name: 'Electrical & Solar',
    icon: 'Zap',
    description: 'Master electricians, EV charger installation, panel upgrades & lighting.',
    typicalJobTurnaround: 'Same-day urgent / scheduled'
  },
  {
    id: 'plumbing',
    name: 'Plumbing & Water',
    icon: 'Wrench',
    description: 'Licensed plumbers, emergency leak repair, pipe renewal & heating.',
    typicalJobTurnaround: 'Emergency 60m / scheduled'
  },
  {
    id: 'landscaping',
    name: 'Landscaping & Grounds',
    icon: 'Trees',
    description: 'Arborists, lawn care, drip irrigation & xeriscaping specialists.',
    typicalJobTurnaround: '2 - 6 hours'
  },
  {
    id: 'painting',
    name: 'Painting & Surface Finishes',
    icon: 'Paintbrush',
    description: 'Interior & exterior painting, cabinet refinishing & decorative coatings.',
    typicalJobTurnaround: '1 - 3 days'
  },
  {
    id: 'roofing',
    name: 'Roofing & Gutters',
    icon: 'Home',
    description: 'Roof inspections, leak repairs, shingle & tile replacement, seamless gutters.',
    typicalJobTurnaround: 'Same-day tarping / 2 days work'
  },
  {
    id: 'maintenance',
    name: 'Household Maintenance',
    icon: 'Hammer',
    description: 'General carpentry, drywall repair, appliance setup & safety audits.',
    typicalJobTurnaround: '2 - 4 hours'
  }
];

// Generate next 5 bookable days with real slots
const generateAvailabilityDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateString = d.toISOString().split('T')[0];
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    dates.push({
      dateString,
      dayLabel,
      slots: [
        { time: '09:00 AM', available: i % 2 === 0 },
        { time: '11:30 AM', available: true },
        { time: '02:00 PM', available: i % 3 !== 0 },
        { time: '04:30 PM', available: true },
        { time: '06:00 PM', available: i > 1 }
      ]
    });
  }
  return dates;
};

export const INITIAL_PROVIDERS: ServiceProvider[] = [
  {
    id: 'pro-voltaic',
    name: 'Elena Rostova',
    businessName: 'Voltaic & Solar Craft Services',
    headline: 'Master Electrician & Certified Renewable Energy Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    coverImage: '/src/assets/images/hero_craftsman_pro_1793666363900.jpg',
    category: 'electrical',
    specialties: ['Residential Rewiring', 'EV Charger Level 2', 'Breaker Panel Upgrades', 'Civic Solar Microgrids'],
    rating: 4.96,
    reviewCount: 148,
    completedJobsCount: 420,
    hourlyRate: 95,
    startingPrice: 110,
    location: {
      neighborhood: 'Old Town & East Ward',
      city: 'Metro Valley',
      distanceMiles: 1.8,
      servicingRadiusMiles: 25
    },
    badges: ['Licensed & Insured', 'City Vetted', 'Government Approved Contractor', 'Master Artisan'],
    yearsInBusiness: 12,
    responseTimeMinutes: 14,
    licenseNumber: 'EL-CA-993821-M',
    insurancePolicyNumber: 'TRV-882-9011',
    bio: 'Elena is a 12-year Master Electrician with state licensing and municipal clearance for civic infrastructure projects. Specializing in smart energy upgrades, complex troubleshooting, and commercial-grade home safety systems.',
    services: [
      {
        id: 'srv-diag',
        name: 'Comprehensive Circuit & Safety Diagnostic',
        durationMinutes: 60,
        price: 110,
        pricingType: 'fixed',
        description: 'Complete thermal inspection of breaker panel, GFCI testing, grounded circuit validation with itemized report.'
      },
      {
        id: 'srv-ev',
        name: 'Level 2 EV Charging Station Installation',
        durationMinutes: 180,
        price: 490,
        pricingType: 'fixed',
        description: 'Dedicated 50A 240V breaker circuit run, NEMA 14-50 outlet or hardwired station mounting with municipal permit filing.'
      },
      {
        id: 'srv-panel',
        name: '200-Amp Main Service Panel Upgrade',
        durationMinutes: 360,
        price: 1850,
        pricingType: 'fixed',
        description: 'Full modernization to 200A service, whole-home surge suppression, whole-house code compliance certification.'
      }
    ],
    availability: generateAvailabilityDates(),
    reviews: [
      {
        id: 'rev-1',
        authorName: 'Marcus Vance',
        authorLocation: 'East Ward Resident',
        rating: 5,
        date: '2 days ago',
        comment: 'Elena upgraded our 1960s fuse box to a modern 200A panel. Punctual, meticulous labeling, and left the utility room cleaner than she found it. Escrow release was seamless.',
        verifiedHire: true,
        projectType: 'Panel Upgrade'
      },
      {
        id: 'rev-2',
        authorName: 'Sarah Jenkins',
        authorLocation: 'Downtown Commercial Loft',
        rating: 5,
        date: '1 week ago',
        comment: 'Installed our Tesla home charger within 2 hours. Handled the municipal inspection documents without any hassle.',
        verifiedHire: true,
        projectType: 'EV Charger'
      }
    ]
  },
  {
    id: 'pro-aura',
    name: 'Chloe Lin & Team',
    businessName: 'Aura Botanical Aesthetics & Nail Bar',
    headline: 'Certified Master Esthetician & Non-Toxic Nail Artistry',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    coverImage: '/src/assets/images/service_beauty_studio_1793666364279.jpg',
    category: 'beauty',
    specialties: ['Japanese Gel Nails', 'HydraFacial Glow', 'Eyebrow Architecture', 'Clean Bridal Glam'],
    rating: 4.98,
    reviewCount: 312,
    completedJobsCount: 890,
    startingPrice: 65,
    location: {
      neighborhood: 'Oak Street Arts District',
      city: 'Metro Valley',
      distanceMiles: 0.6,
      servicingRadiusMiles: 15
    },
    badges: ['Licensed & Insured', 'City Vetted', 'Eco-Certified'],
    yearsInBusiness: 7,
    responseTimeMinutes: 8,
    licenseNumber: 'COS-90142-ST',
    bio: 'Dedicated to clinical-grade hygiene, hypoallergenic botanical formulations, and custom bespoke nail styling. Providing both private studio sessions and on-location community styling for events.',
    services: [
      {
        id: 'srv-manicure',
        name: 'Signature Japanese Gel Sculpting & Art',
        durationMinutes: 75,
        price: 85,
        pricingType: 'fixed',
        description: 'Dry European cuticle care, gentle keratin strengthening base, bespoke non-chipping nail art.'
      },
      {
        id: 'srv-facial',
        name: 'Botanical Enzyme Oxygen Infusion Facial',
        durationMinutes: 60,
        price: 130,
        pricingType: 'fixed',
        description: 'Deep ultrasonic pore cleansing, plant peptide lymphatic massage, high-potency Vitamin C mask.'
      },
      {
        id: 'srv-pedicure',
        name: 'Restorative Organic Pedicure & Reflexology',
        durationMinutes: 60,
        price: 75,
        pricingType: 'fixed',
        description: 'Himalayan salt soak, magnesium exfoliation, calluses smoothed and organic polish application.'
      }
    ],
    availability: generateAvailabilityDates(),
    reviews: [
      {
        id: 'rev-3',
        authorName: 'Camilla Reyes',
        authorLocation: 'Arts District',
        rating: 5,
        date: 'Yesterday',
        comment: 'The studio is calming and spotless. Chloe’s hand-painted nail designs lasted 4 weeks without a single chip. Best beauty pro in town.',
        verifiedHire: true,
        projectType: 'Japanese Gel Sculpting'
      }
    ]
  },
  {
    id: 'pro-cascade',
    name: 'David Sutherland',
    businessName: 'Cascade Precision Plumbing & Hydronics',
    headline: 'Licensed Master Plumber & Backflow Prevention Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    coverImage: '/src/assets/images/service_plumbing_fixtures_1793666364747.jpg',
    category: 'plumbing',
    specialties: ['Tankless Water Heaters', 'Hydro Jetting Drains', 'Emergency Leak Detection', 'Civic Main Connections'],
    rating: 4.92,
    reviewCount: 204,
    completedJobsCount: 560,
    hourlyRate: 110,
    startingPrice: 125,
    location: {
      neighborhood: 'North Riverfront',
      city: 'Metro Valley',
      distanceMiles: 3.2,
      servicingRadiusMiles: 30
    },
    badges: ['Licensed & Insured', 'City Vetted', 'Government Approved Contractor', 'Master Artisan'],
    yearsInBusiness: 18,
    responseTimeMinutes: 12,
    licenseNumber: 'MP-883492-B',
    insurancePolicyNumber: 'CHUBB-PL-4482',
    bio: 'Family-owned plumbing engineering service with 18 years of field leadership. Equipped with acoustic leak sensors, sewer scope video cameras, and certified for municipal public works.',
    services: [
      {
        id: 'srv-plumb-diag',
        name: 'High-Tech Acoustic Leak Detection & Assessment',
        durationMinutes: 60,
        price: 125,
        pricingType: 'fixed',
        description: 'Pinpoints concealed slab leaks and pipe hairline fissures without breaking walls.'
      },
      {
        id: 'srv-tankless',
        name: 'Navien High-Efficiency Tankless Water Heater Install',
        durationMinutes: 240,
        price: 1650,
        pricingType: 'fixed',
        description: 'Removal of old boiler/tank, precision gas line and exhaust venting, endless hot water conversion.'
      },
      {
        id: 'srv-drain',
        name: 'Commercial Hydro-Jet Drain Cleanout & Camera Inspection',
        durationMinutes: 90,
        price: 295,
        pricingType: 'fixed',
        description: 'High-pressure water scour to remove tree roots and grease buildup, with full USB video inspection.'
      }
    ],
    availability: generateAvailabilityDates(),
    reviews: [
      {
        id: 'rev-4',
        authorName: 'Arthur Bell',
        authorLocation: 'Highland Park',
        rating: 5,
        date: '3 days ago',
        comment: 'Had a sudden burst pipe under the sink on a Sunday. David arrived within 45 minutes, replaced the cracked brass fitting, and tested the whole line. True professional.',
        verifiedHire: true,
        projectType: 'Emergency Leak Repair'
      }
    ]
  },
  {
    id: 'pro-verdant',
    name: 'Mateo & Rosa Morales',
    businessName: 'Verdant Oak Landscape & Living Grounds',
    headline: 'Landscape Architects & Smart Irrigation Specialists',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    coverImage: '/src/assets/images/service_landscaping_garden_1793666365328.jpg',
    category: 'landscaping',
    specialties: ['Drought-Tolerant Native Gardens', 'Smart Drip Irrigation', 'Sod & Turf Replacement', 'Arborist Tree Pruning'],
    rating: 4.95,
    reviewCount: 167,
    completedJobsCount: 380,
    startingPrice: 150,
    location: {
      neighborhood: 'Westside Foothills',
      city: 'Metro Valley',
      distanceMiles: 2.5,
      servicingRadiusMiles: 20
    },
    badges: ['Licensed & Insured', 'City Vetted', 'Eco-Certified'],
    yearsInBusiness: 10,
    responseTimeMinutes: 20,
    licenseNumber: 'C-27-89104',
    bio: 'Creating sustainable, low-water outdoor living spaces that enhance neighborhood curb appeal and biodiversity. Active contributors to municipal median greenery programs.',
    services: [
      {
        id: 'srv-garden-revamp',
        name: 'Seasonal Yard Cleanup, Pruning & Edging',
        durationMinutes: 180,
        price: 240,
        pricingType: 'fixed',
        description: 'Complete hedge shaping, ornamental grass trimming, flowerbed weeding, mulch aeration and green waste disposal.'
      },
      {
        id: 'srv-drip',
        name: 'Smart WiFi Drip Irrigation Zone Conversion',
        durationMinutes: 240,
        price: 520,
        pricingType: 'fixed',
        description: 'Automated weather-responsive controller installation, pressure regulators, and drip lines for zero water waste.'
      },
      {
        id: 'srv-paver',
        name: 'Flagstone Pathway & Native Planting Design',
        durationMinutes: 480,
        price: 1400,
        pricingType: 'fixed',
        description: 'Natural quarried stone walkway construction flanked by perennial pollinator flora.'
      }
    ],
    availability: generateAvailabilityDates(),
    reviews: [
      {
        id: 'rev-5',
        authorName: 'Diane Fein',
        authorLocation: 'Westside',
        rating: 5,
        date: '5 days ago',
        comment: 'Transformed our dead lawn into a gorgeous California-native drought-resistant paradise with fragrant lavender and stone pavers. The city even gave us a water rebate!',
        verifiedHire: true,
        projectType: 'Drought-Tolerant Garden'
      }
    ]
  },
  {
    id: 'pro-heritage',
    name: 'Julian Sterling',
    businessName: 'Heritage Brushworks & Architectural Coatings',
    headline: 'Master Decorative Painter & Exterior Preservationist',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
    category: 'painting',
    specialties: ['Historic Trim Restoration', 'Low-VOC Interior Spray', 'Cabinet Factory Finish', 'Facade Weatherproofing'],
    rating: 4.89,
    reviewCount: 94,
    completedJobsCount: 210,
    startingPrice: 280,
    location: {
      neighborhood: 'Historic District',
      city: 'Metro Valley',
      distanceMiles: 4.0,
      servicingRadiusMiles: 25
    },
    badges: ['Licensed & Insured', 'City Vetted', 'Master Artisan'],
    yearsInBusiness: 15,
    responseTimeMinutes: 30,
    licenseNumber: 'C-33-77291',
    bio: 'Julian is renowned for flawless architectural paint finishes, zero-overspray protocols, and expertise in preserving historic woodwork for heritage properties.',
    services: [
      {
        id: 'srv-interior-room',
        name: 'Single Room Precision Painting (Walls & Ceiling)',
        durationMinutes: 360,
        price: 380,
        pricingType: 'fixed',
        description: 'Full surface patching, primer coat, and two coats of premium Benjamin Moore low-VOC eggshell enamel.'
      },
      {
        id: 'srv-cabinets',
        name: 'Kitchen Cabinet Factory-Grade Spray Refinishing',
        durationMinutes: 720,
        price: 1750,
        pricingType: 'fixed',
        description: 'Hardware removal, degreasing, conversion varnish spray for ultra-durable silky finish.'
      }
    ],
    availability: generateAvailabilityDates(),
    reviews: [
      {
        id: 'rev-6',
        authorName: 'Claire Dupont',
        authorLocation: 'Historic District',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Julian transformed our vintage doors and moldings. Sharp edges, flawless finish, covered every piece of furniture meticulously.',
        verifiedHire: true,
        projectType: 'Interior Room'
      }
    ]
  },
  {
    id: 'pro-summit',
    name: 'Tariq Al-Mansoor',
    businessName: 'Summit & Gable Roofing Specialists',
    headline: 'Licensed Roofing Contractor & Storm Mitigation Pro',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1200&q=80',
    category: 'roofing',
    specialties: ['Drone Roof Inspections', 'Leak Sealing & Flashing', 'Architectural Shingles', 'Seamless Copper Gutters'],
    rating: 4.94,
    reviewCount: 118,
    completedJobsCount: 310,
    startingPrice: 195,
    location: {
      neighborhood: 'North Ridge',
      city: 'Metro Valley',
      distanceMiles: 5.1,
      servicingRadiusMiles: 35
    },
    badges: ['Licensed & Insured', 'Government Approved Contractor', 'City Vetted'],
    yearsInBusiness: 14,
    responseTimeMinutes: 18,
    licenseNumber: 'C-39-55102',
    bio: 'Summit & Gable protects properties against heavy weather. Certified GAF Master Elite installer with thermal drone assessments and guaranteed leak-free warranties.',
    services: [
      {
        id: 'srv-roof-audit',
        name: 'High-Res 4K Drone Inspection & Moisture Analysis',
        durationMinutes: 75,
        price: 195,
        pricingType: 'fixed',
        description: 'Complete aerial imagery report detailing tile condition, chimney flashing, valley wear, and thermal heat loss.'
      },
      {
        id: 'srv-roof-repair',
        name: 'Targeted Roof Leak Repair & Flashing Reseal',
        durationMinutes: 180,
        price: 450,
        pricingType: 'fixed',
        description: 'Replacement of up to 15 damaged shingles or cracked tiles, ice/water membrane patch, and butyl mastic sealing.'
      }
    ],
    availability: generateAvailabilityDates(),
    reviews: [
      {
        id: 'rev-7',
        authorName: 'Gregory Scott',
        authorLocation: 'North Ridge',
        rating: 5,
        date: '3 weeks ago',
        comment: 'Tariq found the exact chimney valley leak that two other roofers missed. Fixed it during a storm alert without overcharging.',
        verifiedHire: true,
        projectType: 'Roof Leak Repair'
      }
    ]
  },
  {
    id: 'pro-handy',
    name: 'Samuel Henderson',
    businessName: 'ProHandy Civic & Residential Maintenance',
    headline: 'Multi-Craft Household Specialist & Accessibility Installer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    category: 'maintenance',
    specialties: ['Drywall & Plaster Repair', 'Doors & Window Alignment', 'Senior Grab Bars & Ramps', 'HVAC Filter & Tune-ups'],
    rating: 4.97,
    reviewCount: 220,
    completedJobsCount: 650,
    hourlyRate: 75,
    startingPrice: 90,
    location: {
      neighborhood: 'Central Commons',
      city: 'Metro Valley',
      distanceMiles: 1.1,
      servicingRadiusMiles: 20
    },
    badges: ['Licensed & Insured', 'City Vetted', 'Government Approved Contractor'],
    yearsInBusiness: 9,
    responseTimeMinutes: 10,
    licenseNumber: 'GEN-MT-48821',
    bio: 'Samuel brings precision carpentry, mechanical repairs, and safety retrofits to neighborhood households and public community facilities.',
    services: [
      {
        id: 'srv-maintenance-half',
        name: 'Half-Day Multi-Task Household Punch List (3 Hours)',
        durationMinutes: 180,
        price: 220,
        pricingType: 'fixed',
        description: 'Tackle multiple nagging repairs: door latching, drywall patching, ceiling fan mounts, fixture alignments.'
      },
      {
        id: 'srv-senior-safety',
        name: 'Senior Living Accessibility & Grab Bar Installation',
        durationMinutes: 120,
        price: 160,
        pricingType: 'fixed',
        description: 'Secure wall-stud anchoring of stainless bathroom grab bars, threshold ramp adjustment, and anti-slip treads.'
      }
    ],
    availability: generateAvailabilityDates(),
    reviews: [
      {
        id: 'rev-8',
        authorName: 'Miriam Goldberg',
        authorLocation: 'Central Commons',
        rating: 5,
        date: '4 days ago',
        comment: 'Samuel installed grab bars for my elderly mother and adjusted two sticking front doors. Kind, thorough, and highly skilled.',
        verifiedHire: true,
        projectType: 'Accessibility Retrofit'
      }
    ]
  }
];

export const INITIAL_CIVIC_PROJECTS: CivicProject[] = [
  {
    id: 'civic-1',
    projectCode: 'RFQ-MUNI-2026-08',
    title: 'Oak Street Civic Plaza Solar Lighting & Paver Expansion',
    department: 'Metro Urban Planning & Neighborhood Development',
    neighborhood: 'Oak Street Arts District',
    category: 'electrical',
    targetBudget: 24500,
    deadlineDate: '2026-11-20',
    completionTargetDate: '2026-12-15',
    description: 'Procurement for certified local electrical and landscaping talent to install 8 commercial solar-powered LED pedestrian lampposts and 600 sq ft of permeable flagstone seating plazas.',
    scopePoints: [
      'Install 8 dark-sky compliant standalone solar LED poles with lithium storage',
      'Excavation and sub-base compaction for permeable architectural pavers',
      'Incorporate 2 accessible stone bench footings and conduit for municipal public Wi-Fi',
      'All local labor must be licensed and insured within the municipal jurisdiction'
    ],
    requiredCredentials: ['Master Electrician License', 'Commercial General Liability ($1M+)', 'City Registered Vendor'],
    image: '/src/assets/images/civic_community_park_1793666366331.jpg',
    status: 'open_for_bids',
    bids: [
      {
        id: 'bid-1',
        providerId: 'pro-voltaic',
        providerName: 'Elena Rostova',
        providerBusiness: 'Voltaic & Solar Craft Services',
        providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        proposedBudget: 23200,
        estimatedTimelineDays: 14,
        coverLetter: 'Voltaic has completed 4 similar solar lighting projects for the North Valley school district. We already carry the municipal bonding and can supply commercial grade 15-year warranty poles.',
        licenseVerified: true,
        submittedAt: '2026-10-28',
        status: 'shortlisted'
      }
    ],
    featuredCitizenBenefit: 'Directly lights up pedestrian walkway between the subway station and local market, enhancing safety for 3,400 daily commuters.'
  },
  {
    id: 'civic-2',
    projectCode: 'RFQ-MUNI-2026-12',
    title: 'Historic Carnegie Library Facade & Siding Weatherproofing',
    department: 'Municipal Cultural & Historic Heritage Trust',
    neighborhood: 'Historic District',
    category: 'painting',
    targetBudget: 16800,
    deadlineDate: '2026-11-25',
    completionTargetDate: '2026-12-28',
    description: 'Seeking certified historic preservation painters to scrape, seal, and apply breathable mineral coatings to 1912 library portico and ornamental corbels.',
    scopePoints: [
      'Gentle lead-safe preparation and chemical-free scraping of ornamental dentil trim',
      'Rot repair on 4 exterior cedar column bases using maritime epoxy',
      'Application of 2 coats of Keim mineral breathable architectural paint matching historical color archives',
      'Daily site cleanup to maintain public pedestrian access during open library hours'
    ],
    requiredCredentials: ['EPA Lead-Safe Certified', 'Historic Landmark Guild Certification', 'Active Trade License'],
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80',
    status: 'open_for_bids',
    bids: [],
    featuredCitizenBenefit: 'Preserves 114-year-old landmark while employing local tradespeople with living-wage civic contracts.'
  },
  {
    id: 'civic-3',
    projectCode: 'RFQ-MUNI-2026-15',
    title: 'Eastside Community Center Senior Wing Accessibility Retrofit',
    department: 'Department of Aging & Neighborhood Resilience',
    neighborhood: 'East Ward',
    category: 'maintenance',
    targetBudget: 11500,
    deadlineDate: '2026-11-18',
    completionTargetDate: '2026-12-05',
    description: 'Installation of automated low-energy push-button door operators, heavy-duty ADA commercial handrails, and non-skid ramp resurfacing in community meeting hall.',
    scopePoints: [
      'Replace 3 heavy exterior entry thresholds with low-profile ADA transitions',
      'Install 2 automated door actuators with wireless proximity sensors',
      'Anchor 48 linear feet of continuous brushed stainless handrails into masonry wall',
      'Complete installation over a single weekend to prevent program disruptions'
    ],
    requiredCredentials: ['General Contractor License', 'ADA Accessibility Specialist Certification'],
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    status: 'open_for_bids',
    bids: [],
    featuredCitizenBenefit: 'Allows 200+ local seniors and mobility-assisted neighbors to safely access daily wellness classes and nutrition programs.'
  },
  {
    id: 'civic-4',
    projectCode: 'RFQ-MUNI-2026-19',
    title: 'Community Garden Drip Line & Rain Harvesting Station',
    department: 'Parks, Recreation & Urban Agriculture Division',
    neighborhood: 'Westside Foothills',
    category: 'landscaping',
    targetBudget: 8400,
    deadlineDate: '2026-11-22',
    completionTargetDate: '2026-12-10',
    description: 'Installation of high-capacity 1,200 gallon rainwater cistern, solar booster pump, and automated zone timer system across 32 neighborhood garden plots.',
    scopePoints: [
      'Gravel pad prep and tie-down anchoring for food-grade poly water cistern',
      'Gutter collector diverter and debris leaf screens from pavilion roof',
      'Solar 12V pressure pump with pressure tank and distribution manifold to 32 plots',
      'Host 1 volunteer maintenance workshop for local plot holders upon completion'
    ],
    requiredCredentials: ['C-27 Landscape License or Irrigation Certified', 'City Vendor Registration'],
    image: '/src/assets/images/service_landscaping_garden_1793666365328.jpg',
    status: 'open_for_bids',
    bids: [],
    featuredCitizenBenefit: 'Saves an estimated 45,000 gallons of municipal drinking water annually while increasing local organic produce yields.'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    bookingRef: 'CG-84920',
    providerId: 'pro-voltaic',
    providerName: 'Elena Rostova',
    providerBusiness: 'Voltaic & Solar Craft Services',
    providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    category: 'electrical',
    serviceId: 'srv-diag',
    serviceName: 'Comprehensive Circuit & Safety Diagnostic',
    clientName: 'Julian Thorne',
    clientEmail: 'julian.thorne@example.com',
    clientPhone: '(555) 349-8812',
    serviceAddress: '742 Evergreen Terrace, Metro Valley',
    dateString: '2026-11-04',
    timeSlot: '11:30 AM',
    notes: 'Buzzing sound from kitchen circuit breaker when running microwave.',
    basePrice: 110,
    serviceFee: 8.50,
    protectionFee: 4.50,
    totalAmount: 123.00,
    paymentMethod: 'escrow_hold',
    paymentStatus: 'escrow_secured',
    status: 'confirmed',
    createdAt: '2026-11-02T14:20:00Z'
  }
];
