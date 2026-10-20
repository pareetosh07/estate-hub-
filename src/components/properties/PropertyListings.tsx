import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../data/initialData';
import { Property } from '../../types';
import { BookingModal } from './BookingModal';
import { 
  Search, 
  Filter, 
  MapPin, 
  Home, 
  Calendar, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';

export const PropertyListings: React.FC = () => {
  const { 
    properties, 
    viewPropertyIn3D, 
    analyzePropertyInAI, 
    addBooking, 
    currentUser,
    selectedProperty,
    setSelectedProperty
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedBeds, setSelectedBeds] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(20000000);
  const [bookingTarget, setBookingTarget] = useState<Property | null>(null);

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'All' || p.type === selectedType;
    const matchesBeds = selectedBeds === 'All' || p.bedrooms === Number(selectedBeds);
    const matchesPrice = p.price <= maxPrice;
    return matchesSearch && matchesType && matchesBeds && matchesPrice;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Explore Available Properties
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 tabular-nums">
              {filteredProperties.length} Verified Listings
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover verified apartments, villas, and plots in prime Pune & Mumbai sub-markets.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title or locality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          {/* Property Type */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
            >
              <option value="All">All Typologies</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Independent House">Independent House</option>
              <option value="Plot">Plotted Land</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <select
              value={selectedBeds}
              onChange={(e) => setSelectedBeds(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-900"
            >
              <option value="All">All Bedroom Counts</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>Max Budget:</span>
              <strong className="text-slate-900 tabular-nums">{formatPrice(maxPrice)}</strong>
            </div>
            <input
              type="range"
              min="3000000"
              max="20000000"
              step="500000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <Home className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No properties matching filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your price range or bedroom filters to view available properties.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedType('All');
              setSelectedBeds('All');
              setMaxPrice(20000000);
            }}
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
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
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${
                      p.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="text-xl font-extrabold text-blue-600 tabular-nums">
                    {formatPrice(p.price)}
                  </div>
                  <div className="text-xs text-slate-400 tabular-nums">
                    ₹{Math.round(p.price / p.areaSqFt).toLocaleString()} / sq.ft
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs flex items-center justify-between text-slate-700">
                  <span>📐 {p.area}</span>
                  <span>·</span>
                  <span>🛏️ {p.bedrooms} Beds</span>
                  <span>·</span>
                  <span>🛁 {p.bathrooms} Baths</span>
                  <span>·</span>
                  <span>🚗 {p.parking} Prk</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                <button
                  onClick={() => analyzePropertyInAI(p)}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Audit</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => viewPropertyIn3D(p)}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>3D View</span>
                  </button>
                  <button
                    onClick={() => setBookingTarget(p)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                  >
                    Book Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingTarget && (
        <BookingModal
          property={bookingTarget}
          userName={currentUser.name}
          isOpen={!!bookingTarget}
          onClose={() => setBookingTarget(null)}
          onConfirm={(bookingData) => {
            addBooking({
              ...bookingData,
              status: 'Pending'
            });
          }}
        />
      )}
    </div>
  );
};
