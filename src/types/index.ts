export type UserRole = 'User' | 'Broker' | 'Admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  status: 'Active' | 'Blocked' | 'Inactive';
  company?: string;
}

export type PropertyStatus = 'Approved' | 'Pending' | 'Rejected' | 'Booked' | 'Sold';

export interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  area: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  type: 'Apartment' | 'Villa' | 'Independent House' | 'Plot';
  owner: string;
  seller: string;
  status: PropertyStatus;
  description: string;
  parking: number;
  featured?: boolean;
  coordinates?: { lat: number; lng: number };
  plotDimensions?: { lengthFt: number; widthFt: number };
  sanctionedFloors?: number;
  observedFloors?: number;
  yearBuilt?: number;
  seismicZone?: string;
}

export interface Developer {
  id: number;
  name: string;
  city: string;
  projects: number;
  status: 'Active' | 'Pending';
  rating?: number;
}

export interface Broker {
  id: number;
  name: string;
  company: string;
  city: string;
  properties: number;
  status: 'Active' | 'Pending';
  phone?: string;
}

export interface Booking {
  id: string;
  userId?: number;
  user: string;
  property: string;
  propertyId?: number;
  location: string;
  date: string;
  type: 'Property Visit' | 'Online Meeting';
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  message?: string;
}

export interface PropertyDocument {
  id: string;
  property_id: number;
  property: string;
  location: string;
  file_name: string;
  stored_name: string;
  type: 'Property Agreement' | 'Ownership Document' | 'Sale Deed' | 'Property Brochure' | 'Floor Plan' | 'Other';
  uploaded_at: string;
  file_size?: string;
}

// AI Feature Module Result Interfaces
export interface AIAnalysisResult {
  moduleNumber: 51 | 52 | 53 | 54 | 57 | 58 | 59 | 60;
  moduleTitle: string;
  propertyTitle: string;
  summary: string;
  findings: string[];
  supportingEvidence: string[];
  confidence: 'High' | 'Medium' | 'Low' | 'Preliminary Screening';
  missingInformation: string[];
  recommendations: string[];
  disclaimer: string;
  metrics?: Record<string, string | number>;
  dataQualityRating?: number; // 1 to 5
}
