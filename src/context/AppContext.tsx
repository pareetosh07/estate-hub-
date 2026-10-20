import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Property, Developer, Broker, Booking, PropertyDocument, UserRole, PropertyStatus } from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_DEVELOPERS,
  INITIAL_BROKERS,
  INITIAL_BOOKINGS,
  INITIAL_DOCUMENTS
} from '../data/initialData';

export type NavTab = 
  | 'dashboard'
  | 'properties'
  | 'property-details'
  | 'bookings'
  | 'documents'
  | 'viewer-3d'
  | 'plot-3d'
  | 'ai-intelligence'
  | 'ai-chat'
  | 'price-prediction'
  | 'manage-users'
  | 'manage-developers'
  | 'manage-brokers'
  | 'settings';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  userRole: UserRole;
  switchRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  login: (email: string, role: UserRole) => boolean;
  logout: () => void;
  
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  
  properties: Property[];
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  updatePropertyStatus: (id: number, status: PropertyStatus) => void;
  addProperty: (property: Omit<Property, 'id'>) => void;
  
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBookingStatus: (id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => void;
  
  documents: PropertyDocument[];
  addDocument: (doc: Omit<PropertyDocument, 'id' | 'uploaded_at'>) => void;
  
  users: User[];
  updateUserStatus: (id: number, status: 'Active' | 'Blocked') => void;
  
  developers: Developer[];
  brokers: Broker[];
  
  activeAiModule: number;
  setActiveAiModule: (modNum: number) => void;
  
  // Quick navigation helpers
  viewPropertyIn3D: (property: Property) => void;
  analyzePropertyInAI: (property: Property, moduleNumber?: number) => void;
  bookProperty: (property: Property) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('estatehub_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('estatehub_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default: Rahul Sharma (User)
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('estatehub_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(INITIAL_PROPERTIES[0]);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('estatehub_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [documents, setDocuments] = useState<PropertyDocument[]>(() => {
    const saved = localStorage.getItem('estatehub_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [developers] = useState<Developer[]>(INITIAL_DEVELOPERS);
  const [brokers] = useState<Broker[]>(INITIAL_BROKERS);

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [activeAiModule, setActiveAiModule] = useState<number>(51);

  // Sync state to local persistence
  useEffect(() => {
    localStorage.setItem('estatehub_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('estatehub_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('estatehub_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('estatehub_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    // Find matching user or adapt current user
    const matched = users.find(u => u.role === role && u.status === 'Active') || {
      ...currentUser,
      role
    };
    setCurrentUser(matched);
  };

  const login = (email: string, role: UserRole) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      return true;
    } else {
      // Create and log in
      const newUser: User = {
        id: Date.now(),
        name: email.split('@')[0],
        email,
        role,
        status: 'Active'
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      return true;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const updatePropertyStatus = (id: number, status: PropertyStatus) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const addProperty = (newProp: Omit<Property, 'id'>) => {
    const id = Date.now();
    const created: Property = { ...newProp, id };
    setProperties(prev => [created, ...prev]);
  };

  const addBooking = (newBooking: Omit<Booking, 'id'>) => {
    const id = `BK${String(bookings.length + 1).padStart(3, '0')}`;
    const created: Booking = { ...newBooking, id };
    setBookings(prev => [created, ...prev]);
  };

  const updateBookingStatus = (id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const addDocument = (doc: Omit<PropertyDocument, 'id' | 'uploaded_at'>) => {
    const id = `DOC-${doc.property_id}-${Date.now().toString(36)}`;
    const created: PropertyDocument = {
      ...doc,
      id,
      uploaded_at: new Date().toISOString().split('T')[0],
      file_size: '2.1 MB'
    };
    setDocuments(prev => [created, ...prev]);
  };

  const updateUserStatus = (id: number, status: 'Active' | 'Blocked') => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  };

  const viewPropertyIn3D = (property: Property) => {
    setSelectedProperty(property);
    setActiveTab('viewer-3d');
  };

  const analyzePropertyInAI = (property: Property, moduleNumber?: number) => {
    setSelectedProperty(property);
    if (moduleNumber) setActiveAiModule(moduleNumber);
    setActiveTab('ai-intelligence');
  };

  const bookProperty = (property: Property) => {
    setSelectedProperty(property);
    setActiveTab('properties');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userRole: currentUser.role,
        switchRole,
        isLoggedIn,
        login,
        logout,
        activeTab,
        setActiveTab,
        properties,
        selectedProperty,
        setSelectedProperty,
        updatePropertyStatus,
        addProperty,
        bookings,
        addBooking,
        updateBookingStatus,
        documents,
        addDocument,
        users,
        updateUserStatus,
        developers,
        brokers,
        activeAiModule,
        setActiveAiModule,
        viewPropertyIn3D,
        analyzePropertyInAI,
        bookProperty
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
