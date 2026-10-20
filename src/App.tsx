import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNav } from './components/layout/TopNav';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { UserDashboard } from './components/dashboards/UserDashboard';
import { BrokerDashboard } from './components/dashboards/BrokerDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { PropertyListings } from './components/properties/PropertyListings';
import { DocumentsView } from './components/documents/DocumentsView';
import { Property3DViewer } from './components/viewers3d/Property3DViewer';
import { Plot3DViewer } from './components/viewers3d/Plot3DViewer';
import { AIPropertyIntelligence } from './components/ai/AIPropertyIntelligence';
import { PricePredictionTool } from './components/ai/PricePredictionTool';
import { AIAssistantChat } from './components/ai/AIAssistantChat';
import { SettingsView } from './components/settings/SettingsView';
import { formatPrice } from './data/initialData';
import { Calendar, MapPin, Eye, Sparkles, CheckCircle2, Clock } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    isLoggedIn, 
    userRole, 
    activeTab, 
    setActiveTab, 
    selectedProperty, 
    properties, 
    bookings, 
    updateBookingStatus,
    currentUser,
    viewPropertyIn3D,
    analyzePropertyInAI
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const currentProperty = selectedProperty || properties[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navigation Bar with 3-Zone Contract & Role Switcher */}
      <TopNav onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar 
          isOpenMobile={mobileSidebarOpen} 
          onCloseMobile={() => setMobileSidebarOpen(false)} 
        />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* TAB 1: DASHBOARD (Role-based: User, Broker, or Admin) */}
          {activeTab === 'dashboard' && (
            <>
              {userRole === 'Admin' && <AdminDashboard />}
              {userRole === 'Broker' && <BrokerDashboard />}
              {userRole === 'User' && <UserDashboard />}
            </>
          )}

          {/* TAB 2: EXPLORE PROPERTIES */}
          {activeTab === 'properties' && <PropertyListings />}

          {/* TAB 3: MY BOOKINGS (Dedicated Bookings Management) */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                      Property Bookings & Visits
                    </h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 tabular-nums">
                      {bookings.length} Total Appointments
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Monitor upcoming property walkthroughs, video consultations, and inspection schedules.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('properties')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
                >
                  Schedule New Visit
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{b.property}</span>
                          <span className="text-xs text-slate-400 font-mono">({b.id})</span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
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
                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                          <span>📍 {b.location}</span>
                          <span>·</span>
                          <span>👤 Visitor: {b.user}</span>
                          <span>·</span>
                          <span className="font-semibold text-slate-800">📅 {b.date}</span>
                          <span>·</span>
                          <span className="font-medium text-blue-700">{b.type}</span>
                        </div>
                        {b.message && (
                          <div className="text-xs text-slate-500 italic mt-1">
                            Note: "{b.message}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {userRole === 'Admin' || userRole === 'Broker' ? (
                          <>
                            {b.status === 'Pending' && (
                              <button
                                onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                              >
                                Confirm Visit
                              </button>
                            )}
                            {b.status !== 'Cancelled' && (
                              <button
                                onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </>
                        ) : (
                          b.status === 'Pending' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                              className="px-3 py-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Withdraw Request
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROPERTY DOCUMENTS */}
          {activeTab === 'documents' && <DocumentsView />}

          {/* TAB 5: 3D PROPERTY PREVIEW */}
          {activeTab === 'viewer-3d' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Interactive 3D Property Model Viewer
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Lightweight WebGL 3D architectural representation with Exterior, Interior, and Floor Plan views.
                  </p>
                </div>

                {/* Property Picker for 3D View */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 shrink-0">Model:</span>
                  <select
                    value={currentProperty.id}
                    onChange={(e) => {
                      const found = properties.find((p) => p.id === Number(e.target.value));
                      if (found) {
                        viewPropertyIn3D(found);
                      }
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.location})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Property3DViewer
                property={currentProperty}
                onBookVisit={() => setActiveTab('properties')}
                onLaunchAIAnalysis={(prop) => analyzePropertyInAI(prop)}
              />
            </div>
          )}

          {/* TAB 6: 3D PLOT & MASSING */}
          {activeTab === 'plot-3d' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Interactive 3D Cadastral Plot & Massing Explorer
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Explore boundary dimensions, municipal setbacks, road access corridors, and conceptual building massing.
                </p>
              </div>

              <Plot3DViewer property={currentProperty} />
            </div>
          )}

          {/* TAB 7: AI PROPERTY INTELLIGENCE (8 MODULES) */}
          {activeTab === 'ai-intelligence' && <AIPropertyIntelligence />}

          {/* TAB 8: PRICE VALUATION ENGINE */}
          {activeTab === 'price-prediction' && <PricePredictionTool />}

          {/* TAB 9: REAL ESTATE AI CHATBOT */}
          {activeTab === 'ai-chat' && <AIAssistantChat />}

          {/* TAB 10: SETTINGS */}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
