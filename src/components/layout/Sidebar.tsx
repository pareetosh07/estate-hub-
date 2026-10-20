import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { 
  Home, 
  Search, 
  Calendar, 
  FileText, 
  Eye, 
  Sparkles, 
  Bot, 
  TrendingUp, 
  Settings, 
  Users, 
  Building, 
  Layers, 
  LogOut,
  Ruler,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { 
    activeTab, 
    setActiveTab, 
    userRole, 
    currentUser, 
    logout, 
    setActiveAiModule 
  } = useApp();

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const navItemClass = (tab: NavTab) => `
    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap
    ${
      activeTab === tab
        ? 'bg-blue-600 text-white shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }
  `;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 overflow-y-auto transition-transform ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Main Navigation Section */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Main Menu
            </div>

            <button onClick={() => handleNav('dashboard')} className={navItemClass('dashboard')}>
              <Home className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button onClick={() => handleNav('properties')} className={navItemClass('properties')}>
              <Search className="w-4 h-4 shrink-0" />
              <span>Explore Properties</span>
            </button>

            <button onClick={() => handleNav('bookings')} className={navItemClass('bookings')}>
              <Calendar className="w-4 h-4 shrink-0" />
              <span>My Bookings</span>
            </button>

            <button onClick={() => handleNav('documents')} className={navItemClass('documents')}>
              <FileText className="w-4 h-4 shrink-0" />
              <span>Property Documents</span>
            </button>
          </div>

          {/* 3D Visual Explorers */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              3D Spatial Exploration
            </div>

            <button onClick={() => handleNav('viewer-3d')} className={navItemClass('viewer-3d')}>
              <Eye className="w-4 h-4 text-blue-500 shrink-0" />
              <span>3D Property Preview</span>
            </button>

            <button onClick={() => handleNav('plot-3d')} className={navItemClass('plot-3d')}>
              <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>3D Plot & Massing</span>
            </button>
          </div>

          {/* AI Intelligence Suite */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              AI Intelligence Suite
            </div>

            <button onClick={() => handleNav('ai-intelligence')} className={navItemClass('ai-intelligence')}>
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>AI Property Intelligence</span>
            </button>

            <button onClick={() => handleNav('price-prediction')} className={navItemClass('price-prediction')}>
              <TrendingUp className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Price Valuation Engine</span>
            </button>

            <button onClick={() => handleNav('ai-chat')} className={navItemClass('ai-chat')}>
              <Bot className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Real Estate AI Assistant</span>
            </button>
          </div>

          {/* Admin Specific Governance Links */}
          {userRole === 'Admin' && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="px-3 text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-2">
                Administration
              </div>

              <button
                onClick={() => {
                  handleNav('dashboard');
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Users className="w-4 h-4 text-purple-600 shrink-0" />
                <span>User & Broker Roster</span>
              </button>
            </div>
          )}

          {/* Settings */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <button onClick={() => handleNav('settings')} className={navItemClass('settings')}>
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <div className="font-semibold text-slate-900 text-xs truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 font-medium">{currentUser.role} Account</div>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
