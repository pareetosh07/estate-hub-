import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../data/initialData';
import { 
  Home, 
  Calendar, 
  FileText, 
  Bot, 
  MapPin, 
  ArrowRight, 
  Eye, 
  Sparkles,
  Layers,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { 
    currentUser, 
    properties, 
    bookings, 
    documents, 
    setActiveTab, 
    viewPropertyIn3D, 
    analyzePropertyInAI,
    setSelectedProperty
  } = useApp();

  const userBookings = bookings.filter(
    (b) => b.user.toLowerCase() === currentUser.name.toLowerCase() || b.user === 'Rahul Sharma'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner (Preserving original styling with professional light elevation) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-7 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2">
            EstateHub Real Estate AI Platform
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Discover verified properties, schedule immersive 3D visits, inspect municipal documentation, and run 8 specialized AI structural & cadastral intelligence audits.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => setActiveTab('properties')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Explore All Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('ai-intelligence')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>AI Property Intelligence</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative geometric overlay */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 4 Primary Metric Cards (Matching Userdashboard_2cb20653.py metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('properties')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Available Properties</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-3">
            {properties.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Verified MLS Listings</div>
        </div>

        <div 
          onClick={() => setActiveTab('bookings')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">My Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-3">
            {userBookings.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Scheduled Visits & Meetings</div>
        </div>

        <div 
          onClick={() => setActiveTab('documents')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Property Documents</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-3">
            {documents.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Sanction Plans & Deeds</div>
        </div>

        <div 
          onClick={() => setActiveTab('ai-intelligence')}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">AI Intelligence Suite</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-3">
            8 Modules
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Cadastral, Utility, Seismic</div>
        </div>
      </div>

      {/* Featured Properties Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Featured Properties</h2>
            <p className="text-xs text-slate-500">Curated residential units with complete CAD drawings & 3D models</p>
          </div>
          <button
            onClick={() => setActiveTab('properties')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {properties.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {p.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-blue-600 tabular-nums">
                      {formatPrice(p.price)}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">
                      ₹{Math.round(p.price / p.areaSqFt).toLocaleString()}/sq.ft
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs flex items-center justify-between text-slate-700">
                  <span>📐 {p.area}</span>
                  <span>·</span>
                  <span>🛏️ {p.bedrooms} Beds</span>
                  <span>·</span>
                  <span>🛁 {p.bathrooms} Baths</span>
                  <span>·</span>
                  <span>🚗 {p.parking} Parking</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">Seller: <strong className="text-slate-800">{p.seller}</strong></span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => viewPropertyIn3D(p)}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>3D View</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProperty(p);
                      setActiveTab('properties');
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                  >
                    Book Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Recent Visit Bookings
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('bookings')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Manage Bookings
          </button>
        </div>

        {userBookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            You don't have any pending property visits scheduled.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {userBookings.map((b) => (
              <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <span>{b.property}</span>
                    <span className="text-slate-400 font-mono">({b.id})</span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-2 mt-1">
                    <span>📍 {b.location}</span>
                    <span>·</span>
                    <span>📅 {b.date}</span>
                    <span>·</span>
                    <span className="font-medium text-slate-700">{b.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                      b.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : b.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
