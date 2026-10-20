import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Home, 
  Sparkles, 
  User, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  Building, 
  Calendar,
  Layers,
  Bot
} from 'lucide-react';

interface TopNavProps {
  onToggleSidebar?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar }) => {
  const { currentUser, userRole, switchRole, logout, setActiveTab, activeTab } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              ☰
            </button>
          )}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('dashboard');
            }}
            className="flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
              🏠
            </span>
            <span>
              Estate<span className="text-blue-600">Hub</span>
            </span>
          </a>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeTab === 'dashboard' ? 'text-blue-600' : ''
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('properties')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeTab === 'properties' ? 'text-blue-600' : ''
            }`}
          >
            Properties
          </button>

          <button
            onClick={() => setActiveTab('viewer-3d')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeTab === 'viewer-3d' ? 'text-blue-600' : ''
            }`}
          >
            3D Preview
          </button>

          <button
            onClick={() => setActiveTab('ai-intelligence')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 flex items-center gap-1.5 ${
              activeTab === 'ai-intelligence' ? 'text-blue-600' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-chat')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 flex items-center gap-1.5 ${
              activeTab === 'ai-chat' ? 'text-blue-600' : ''
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Assistant</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action / Account & Role Switcher */}
        <div className="flex items-center gap-3 shrink-0 relative">
          {/* Quick Role Switcher Trigger */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  userRole === 'Admin'
                    ? 'bg-purple-600'
                    : userRole === 'Broker'
                    ? 'bg-emerald-600'
                    : 'bg-blue-600'
                }`}
              ></span>
              <span className="hidden sm:inline">{currentUser.name}</span>
              <span className="text-[11px] font-normal text-slate-500">({userRole})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </div>

                <button
                  onClick={() => handleSwitch('User')}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    userRole === 'User' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">👤 Buyer / Investor</span>
                  {userRole === 'User' && <span className="text-xs">✓</span>}
                </button>

                <button
                  onClick={() => handleSwitch('Broker')}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    userRole === 'Broker' ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">🏢 Broker / Agency</span>
                  {userRole === 'Broker' && <span className="text-xs">✓</span>}
                </button>

                <button
                  onClick={() => handleSwitch('Admin')}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    userRole === 'Admin' ? 'text-purple-600 font-bold bg-purple-50/50' : 'text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">⚙️ Administrator</span>
                  {userRole === 'Admin' && <span className="text-xs">✓</span>}
                </button>

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      setActiveTab('settings');
                    }}
                    className="w-full px-3 py-2 text-left text-slate-600 hover:bg-slate-50"
                  >
                    Settings
                  </button>
                  <button
                    onClick={logout}
                    className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
