import { User, Property, Developer, Broker, Booking, PropertyDocument } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    role: 'User',
    status: 'Active',
    phone: '+91 98220 12345'
  },
  {
    id: 2,
    name: 'Priya Patil',
    email: 'priya@gmail.com',
    role: 'User',
    status: 'Active',
    phone: '+91 98220 54321'
  },
  {
    id: 3,
    name: 'Amit Patil',
    email: 'broker@estatehub.com',
    role: 'Broker',
    status: 'Active',
    company: 'Patil Real Estate',
    phone: '+91 98900 87654'
  },
  {
    id: 4,
    name: 'Neha Joshi',
    email: 'neha@gmail.com',
    role: 'User',
    status: 'Blocked',
    phone: '+91 98233 45678'
  },
  {
    id: 5,
    name: 'Vikram Mehta',
    email: 'vikram@gmail.com',
    role: 'Broker',
    status: 'Active',
    company: 'Mehta Realty',
    phone: '+91 98500 11223'
  },
  {
    id: 6,
    name: 'EstateHub Admin',
    email: 'admin@estatehub.com',
    role: 'Admin',
    status: 'Active',
    phone: '+91 99000 00001'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 101,
    title: 'Premium 2 BHK Apartment',
    location: 'Wakad, Pune',
    price: 6500000,
    area: '950 sq.ft',
    areaSqFt: 950,
    bedrooms: 2,
    bathrooms: 2,
    type: 'Apartment',
    owner: 'ABC Realty',
    seller: 'ABC Realty',
    status: 'Approved',
    description: 'Vastu-compliant East-facing 2 BHK in prime Wakad location near Mumbai-Pune Expressway. Features modular kitchen, vitrified tiling, and private balcony.',
    parking: 1,
    featured: true,
    coordinates: { lat: 18.5987, lng: 73.7684 },
    plotDimensions: { lengthFt: 80, widthFt: 60 },
    sanctionedFloors: 14,
    observedFloors: 14,
    yearBuilt: 2021,
    seismicZone: 'Zone III'
  },
  {
    id: 102,
    title: 'Modern 3 BHK Apartment',
    location: 'Baner, Pune',
    price: 9200000,
    area: '1350 sq.ft',
    areaSqFt: 1350,
    bedrooms: 3,
    bathrooms: 3,
    type: 'Apartment',
    owner: 'Prime Properties',
    seller: 'Prime Properties',
    status: 'Approved',
    description: 'Spacious high-rise apartment on Baner-Pashan link road with panoramic hill views, imported marble flooring, 2 dedicated covered parkings and smart home wiring.',
    parking: 2,
    featured: true,
    coordinates: { lat: 18.5590, lng: 73.7868 },
    plotDimensions: { lengthFt: 100, widthFt: 75 },
    sanctionedFloors: 18,
    observedFloors: 18,
    yearBuilt: 2023,
    seismicZone: 'Zone III'
  },
  {
    id: 103,
    title: 'Luxury Villa',
    location: 'Hinjewadi, Pune',
    price: 14500000,
    area: '2200 sq.ft',
    areaSqFt: 2200,
    bedrooms: 4,
    bathrooms: 4,
    type: 'Villa',
    owner: 'Elite Homes',
    seller: 'Elite Homes',
    status: 'Pending',
    description: 'Independent gated community villa with private landscaped garden, double-height ceiling living room, solar water heating, and EV charging station.',
    parking: 2,
    featured: true,
    coordinates: { lat: 18.5913, lng: 73.7389 },
    plotDimensions: { lengthFt: 65, widthFt: 45 },
    sanctionedFloors: 3,
    observedFloors: 3,
    yearBuilt: 2024,
    seismicZone: 'Zone III'
  },
  {
    id: 104,
    title: 'Affordable 1 BHK',
    location: 'Kharadi, Pune',
    price: 4200000,
    area: '650 sq.ft',
    areaSqFt: 650,
    bedrooms: 1,
    bathrooms: 1,
    type: 'Apartment',
    owner: 'City Homes',
    seller: 'City Homes',
    status: 'Pending',
    description: 'Compact 1 BHK near EON Free Zone and World Trade Center Kharadi. Ideal investment yield property with low maintenance and ready-to-move status.',
    parking: 1,
    featured: false,
    coordinates: { lat: 18.5514, lng: 73.9348 },
    plotDimensions: { lengthFt: 60, widthFt: 40 },
    sanctionedFloors: 10,
    observedFloors: 10,
    yearBuilt: 2022,
    seismicZone: 'Zone III'
  },
  {
    id: 105,
    title: '4 BHK Luxury Flat',
    location: 'Koregaon Park, Pune',
    price: 18500000,
    area: '2800 sq.ft',
    areaSqFt: 2800,
    bedrooms: 4,
    bathrooms: 4,
    type: 'Apartment',
    owner: 'Urban Developers',
    seller: 'Urban Developers',
    status: 'Approved',
    description: 'Ultra-exclusive residence in Koregaon Park Lane 5 with private elevator access, servant quarters, VRF air conditioning, and clubhouse membership.',
    parking: 3,
    featured: true,
    coordinates: { lat: 18.5362, lng: 73.8938 },
    plotDimensions: { lengthFt: 120, widthFt: 90 },
    sanctionedFloors: 12,
    observedFloors: 12,
    yearBuilt: 2024,
    seismicZone: 'Zone III'
  }
];

export const INITIAL_DEVELOPERS: Developer[] = [
  {
    id: 1,
    name: 'ABC Developers',
    city: 'Pune',
    projects: 8,
    status: 'Active',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Urban Developers',
    city: 'Mumbai',
    projects: 12,
    status: 'Active',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Prime Buildtech',
    city: 'Pune',
    projects: 5,
    status: 'Pending',
    rating: 4.5
  },
  {
    id: 4,
    name: 'Elite Infrastructure',
    city: 'Nashik',
    projects: 7,
    status: 'Active',
    rating: 4.6
  }
];

export const INITIAL_BROKERS: Broker[] = [
  {
    id: 1,
    name: 'Vikram Mehta',
    company: 'Mehta Realty',
    city: 'Pune',
    properties: 15,
    status: 'Active',
    phone: '+91 98500 11223'
  },
  {
    id: 2,
    name: 'Sneha Deshmukh',
    company: 'Deshmukh Properties',
    city: 'Mumbai',
    properties: 11,
    status: 'Active',
    phone: '+91 98700 33445'
  },
  {
    id: 3,
    name: 'Rohan Shah',
    company: 'Shah Estate',
    city: 'Pune',
    properties: 7,
    status: 'Pending',
    phone: '+91 98111 66778'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK001',
    user: 'Rahul Sharma',
    property: 'Premium 2 BHK Apartment',
    propertyId: 101,
    location: 'Wakad, Pune',
    date: '2026-10-24',
    type: 'Property Visit',
    status: 'Pending',
    message: 'Looking to inspect on Saturday afternoon. Please confirm availability.'
  },
  {
    id: 'BK002',
    user: 'Priya Patil',
    property: 'Modern 3 BHK Apartment',
    propertyId: 102,
    location: 'Baner, Pune',
    date: '2026-10-26',
    type: 'Online Meeting',
    status: 'Confirmed',
    message: 'Need video walkthrough and discussion regarding society amenities.'
  },
  {
    id: 'BK003',
    user: 'Amit Kulkarni',
    property: 'Luxury Villa',
    propertyId: 103,
    location: 'Hinjewadi, Pune',
    date: '2026-10-28',
    type: 'Property Visit',
    status: 'Pending',
    message: 'Family visit scheduled. Interested in plot dimension verification.'
  },
  {
    id: 'BK004',
    user: 'Neha Joshi',
    property: 'Affordable 1 BHK',
    propertyId: 104,
    location: 'Kharadi, Pune',
    date: '2026-10-30',
    type: 'Property Visit',
    status: 'Cancelled',
    message: 'Cancelled due to date conflict.'
  }
];

export const INITIAL_DOCUMENTS: PropertyDocument[] = [
  {
    id: 'DOC-101-1',
    property_id: 101,
    property: 'Premium 2 BHK Apartment',
    location: 'Wakad, Pune',
    file_name: 'Wakad_Sanctioned_Floor_Plan.pdf',
    stored_name: 'Wakad_Sanctioned_Floor_Plan_a8f9b2c1.pdf',
    type: 'Floor Plan',
    uploaded_at: '2026-09-15',
    file_size: '2.4 MB'
  },
  {
    id: 'DOC-101-2',
    property_id: 101,
    property: 'Premium 2 BHK Apartment',
    location: 'Wakad, Pune',
    file_name: 'PMC_Commencement_Certificate.pdf',
    stored_name: 'PMC_Commencement_Certificate_e4b1a3d0.pdf',
    type: 'Ownership Document',
    uploaded_at: '2026-09-18',
    file_size: '1.8 MB'
  },
  {
    id: 'DOC-102-1',
    property_id: 102,
    property: 'Modern 3 BHK Apartment',
    location: 'Baner, Pune',
    file_name: 'Baner_Architectural_Drawings.pdf',
    stored_name: 'Baner_Architectural_Drawings_c7e3f890.pdf',
    type: 'Floor Plan',
    uploaded_at: '2026-10-01',
    file_size: '3.6 MB'
  },
  {
    id: 'DOC-102-2',
    property_id: 102,
    property: 'Modern 3 BHK Apartment',
    location: 'Baner, Pune',
    file_name: 'RERA_Registration_Certificate.pdf',
    stored_name: 'RERA_Registration_Certificate_f9a8d21b.pdf',
    type: 'Ownership Document',
    uploaded_at: '2026-10-02',
    file_size: '1.2 MB'
  },
  {
    id: 'DOC-103-1',
    property_id: 103,
    property: 'Luxury Villa',
    location: 'Hinjewadi, Pune',
    file_name: 'Villa_Plot_Cadastral_Survey.pdf',
    stored_name: 'Villa_Plot_Cadastral_Survey_d1e2f3c4.pdf',
    type: 'Property Agreement',
    uploaded_at: '2026-10-05',
    file_size: '4.1 MB'
  }
];

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};
