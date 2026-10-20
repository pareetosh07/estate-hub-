import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../data/initialData';
import { 
  ShieldCheck, 
  Users, 
  Home, 
  Calendar, 
  Building, 
  Check, 
  X, 
  AlertTriangle, 
  Search, 
  UserCheck, 
  Eye, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    users, 
    properties, 
    developers, 
    brokers, 
    bookings, 
    updatePropertyStatus, 
    updateBookingStatus, 
    updateUserStatus,
    viewPropertyIn3D,
    analyzePropertyInAI,
    setActiveTab
  } = useApp();

  const [propertyFilter, setPropertyFilter] = useState<'All' | 'Approved' | 'Pending' | 'Rejected'>('All');
  const [propertySearch, setPropertySearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'overview' | 'properties' | 'users' | 'bookings'>('overview');

  const pendingProperties = properties.filter((p) => p.status === 'Pending');
  const pendingBookings = bookings.filter((b) => b.status === 'Pending');
  const activeDevelopers = developers.filter((d) => d.status === 'Active');
  const activeBrokers = brokers.filter((b) => b.status === 'Active');

  const filteredProperties = properties.filter((p) => {
    const matchesFilter = propertyFilter === 'All' || p.status === propertyFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
      p.location.toLowerCase().includes(propertySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Admin Title & Subtitle matching Admindash_808fcda0.py */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Admin Control Center
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
              Platform Governance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage users, property approvals, developers, brokers, and booking approvals.
          </p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveAdminSubTab('overview')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeAdminSubTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveAdminSubTab('properties')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeAdminSubTab === 'properties' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manage Properties ({pendingProperties.length} pending)
          </button>
          <button
            onClick={() => setActiveAdminSubTab('users')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeAdminSubTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveAdminSubTab('bookings')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeAdminSubTab === 'bookings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bookings ({pendingBookings.length} pending)
          </button>
        </div>
      </div>

      {/* Row 1 Metrics: Total Users, Properties, Developers, Bookings */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Users</span>
          <div className="text-2xl font-bold text-blue-600 tabular-nums mt-3">
            {users.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Registered Accounts</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Properties</span>
          <div className="text-2xl font-bold text-blue-600 tabular-nums mt-3">
            {properties.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Listings on Platform</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Developers</span>
          <div className="text-2xl font-bold text-blue-600 tabular-nums mt-3">
            {developers.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{activeDevelopers.length} Active Partners</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Bookings</span>
          <div className="text-2xl font-bold text-blue-600 tabular-nums mt-3">
            {bookings.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Visits & Meetings</div>
        </div>
      </div>

      {/* Row 2 Metrics: Pending Properties, Active Developers, Active Brokers, Pending Bookings */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs">
          <div className="text-amber-800 font-semibold">Pending Properties</div>
          <div className="text-xl font-bold text-amber-900 tabular-nums mt-1">{pendingProperties.length}</div>
        </div>
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-xs">
          <div className="text-blue-800 font-semibold">Active Developers</div>
          <div className="text-xl font-bold text-blue-900 tabular-nums mt-1">{activeDevelopers.length}</div>
        </div>
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs">
          <div className="text-emerald-800 font-semibold">Active Brokers</div>
          <div className="text-xl font-bold text-emerald-900 tabular-nums mt-1">{activeBrokers.length}</div>
        </div>
        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 text-xs">
          <div className="text-purple-800 font-semibold">Pending Bookings</div>
          <div className="text-xl font-bold text-purple-900 tabular-nums mt-1">{pendingBookings.length}</div>
        </div>
      </div>

      {/* OVERVIEW SUB-TAB */}
      {activeAdminSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Pending Property Approvals Queue */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Property Listings Awaiting Approval ({pendingProperties.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Review submitted seller listings and grant or withhold MLS approval
                </p>
              </div>
            </div>

            {pendingProperties.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                All property listings have been reviewed and approved.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingProperties.map((p) => (
                  <div key={p.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{p.title}</span>
                        <span className="text-xs text-slate-400 font-mono">#{p.id}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                          Pending Approval
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>📍 {p.location}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-800 tabular-nums">{formatPrice(p.price)}</span>
                        <span>·</span>
                        <span>Seller: {p.seller}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewPropertyIn3D(p)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>3D Preview</span>
                      </button>
                      <button
                        onClick={() => updatePropertyStatus(p.id, 'Approved')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => updatePropertyStatus(p.id, 'Rejected')}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Developers & Brokers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Active Developers ({developers.length})
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {developers.map((d) => (
                  <div key={d.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-900">{d.name}</div>
                      <div className="text-slate-400">📍 {d.city} · {d.projects} Active Projects</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Registered Brokers ({brokers.length})
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {brokers.map((b) => (
                  <div key={b.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-900">{b.name}</div>
                      <div className="text-slate-400">🏢 {b.company} · {b.city} · {b.properties} Listings</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROPERTIES SUB-TAB */}
      {activeAdminSubTab === 'properties' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search property or location..."
                value={propertySearch}
                onChange={(e) => setPropertySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-slate-500">Filter:</span>
              <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs">
                {(['All', 'Approved', 'Pending', 'Rejected'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setPropertyFilter(status)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      propertyFilter === status ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredProperties.map((p) => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{p.title}</span>
                    <span className="text-xs text-slate-400 font-mono">#{p.id}</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <span>📍 {p.location}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-800 tabular-nums">{formatPrice(p.price)}</span>
                    <span>·</span>
                    <span>Owner: {p.owner}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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

                  {p.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => updatePropertyStatus(p.id, 'Approved')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updatePropertyStatus(p.id, 'Rejected')}
                        className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => updatePropertyStatus(p.id, p.status === 'Approved' ? 'Pending' : 'Approved')}
                      className="px-3 py-1 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium"
                    >
                      Toggle Status
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS SUB-TAB */}
      {activeAdminSubTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Manage Registered Users</h2>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {filteredUsers.map((u) => (
              <div key={u.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <span>{u.name}</span>
                    <span className="text-slate-400 font-mono">(ID: {u.id})</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    📧 {u.email} · Role: <strong className="text-slate-800">{u.role}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      u.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {u.status}
                  </span>
                  <button
                    onClick={() => updateUserStatus(u.id, u.status === 'Active' ? 'Blocked' : 'Active')}
                    className="px-3 py-1 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-[11px]"
                  >
                    {u.status === 'Active' ? 'Block User' : 'Unblock User'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKINGS SUB-TAB */}
      {activeAdminSubTab === 'bookings' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Booking Requests & Approvals</h2>
          <div className="divide-y divide-slate-100 text-xs">
            {bookings.map((b) => (
              <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <span>{b.property}</span>
                    <span className="text-slate-400 font-mono font-normal">({b.id})</span>
                  </div>
                  <div className="text-slate-500 mt-1">
                    👤 Visitor: <strong className="text-slate-800">{b.user}</strong> · 📅 {b.date} · Type: {b.type}
                  </div>
                  {b.message && (
                    <div className="text-slate-400 italic mt-0.5 text-[11px]">Note: "{b.message}"</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      b.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : b.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {b.status}
                  </span>

                  {b.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px]"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                        className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold text-[11px]"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
