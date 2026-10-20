import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../data/initialData';
import { Property, PropertyStatus } from '../../types';
import { 
  Building, 
  Plus, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  ExternalLink,
  Eye,
  FileText,
  DollarSign
} from 'lucide-react';

export const BrokerDashboard: React.FC = () => {
  const { 
    currentUser, 
    properties, 
    addProperty, 
    bookings, 
    viewPropertyIn3D, 
    analyzePropertyInAI,
    setActiveTab 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPrice, setNewPrice] = useState(7500000);
  const [newAreaSqFt, setNewAreaSqFt] = useState(1150);
  const [newBeds, setNewBeds] = useState(2);
  const [newBaths, setNewBaths] = useState(2);
  const [newType, setNewType] = useState<'Apartment' | 'Villa' | 'Independent House' | 'Plot'>('Apartment');
  const [newDesc, setNewDesc] = useState('');

  // Broker listings
  const brokerProperties = properties; // Display all managed properties with status controls
  const brokerBookings = bookings;

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation) return;

    addProperty({
      title: newTitle,
      location: newLocation,
      price: Number(newPrice),
      area: `${newAreaSqFt} sq.ft`,
      areaSqFt: Number(newAreaSqFt),
      bedrooms: Number(newBeds),
      bathrooms: Number(newBaths),
      type: newType,
      owner: currentUser.name,
      seller: currentUser.company || currentUser.name,
      status: 'Pending', // Subject to Admin approval
      description: newDesc || 'Modern residential property with verified municipal clearances.',
      parking: 1,
      plotDimensions: { lengthFt: 80, widthFt: 60 }
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewLocation('');
  };

  return (
    <div className="space-y-6">
      {/* Broker Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white p-7 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-2">
            Broker & Agency Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Broker Portal — {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Manage agency listings, review buyer visit appointments, upload cadastral plans, and run AI development analyses for client pitch decks.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Property</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-intelligence')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors"
            >
              Run AI Client Audit
            </button>
          </div>
        </div>
      </div>

      {/* Broker KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active Listings</span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-3">
            {brokerProperties.filter((p) => p.status === 'Approved').length}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Approved on MLS</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Pending Review</span>
          <div className="text-2xl font-bold text-amber-600 tabular-nums mt-3">
            {brokerProperties.filter((p) => p.status === 'Pending').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting Admin Clearance</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Buyer Inquiries</span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-3">
            {brokerBookings.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Scheduled Walkthroughs</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Portfolio Value</span>
          <div className="text-2xl font-bold text-blue-600 tabular-nums mt-3">
            ₹{(brokerProperties.reduce((acc, p) => acc + p.price, 0) / 10000000).toFixed(1)} Cr
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Gross Asset Value</div>
        </div>
      </div>

      {/* Managed Properties Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Agency Listings Portfolio</h2>
            <p className="text-xs text-slate-500">Review status, launch 3D views, and trigger AI compliance checks</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Listing</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Property</th>
                <th className="px-5 py-3">Configuration</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {brokerProperties.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{p.title}</div>
                    <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {p.location}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-slate-800">{p.type}</span>
                    <span className="text-slate-400"> · </span>
                    <span className="text-slate-600 tabular-nums">{p.area}</span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900 tabular-nums">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        p.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => viewPropertyIn3D(p)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-[11px] transition-colors"
                    >
                      3D View
                    </button>
                    <button
                      onClick={() => analyzePropertyInAI(p)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-semibold text-[11px] transition-colors"
                    >
                      AI Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add New Property Listing</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skyline 3 BHK Tower Residence"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balewadi High Street, Pune"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    step="50000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Area (sq.ft)</label>
                  <input
                    type="number"
                    value={newAreaSqFt}
                    onChange={(e) => setNewAreaSqFt(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={newBeds}
                    onChange={(e) => setNewBeds(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={newBaths}
                    onChange={(e) => setNewBaths(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Property Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Plot">Plotted Land</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Provide property features, road access, and amenities..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Publish Listing (Submit for Approval)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
