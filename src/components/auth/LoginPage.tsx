import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Home, ShieldCheck, User, Building, CheckCircle2, Lock } from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login } = useApp();
  const [role, setRole] = useState<UserRole>('User');
  const [email, setEmail] = useState('user@estatehub.com');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    const ok = login(email, role);
    if (ok) {
      if (onSuccess) onSuccess();
    } else {
      setError('Invalid credentials.');
    }
  };

  const handleQuickFill = (userRole: UserRole, userEmail: string) => {
    setRole(userRole);
    setEmail(userEmail);
    setPassword('demo123');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left Column: Premium Architectural Brand Hero matching logins_efc85936.py */}
      <div className="lg:w-1/2 min-h-[420px] lg:min-h-screen relative flex flex-col justify-between p-8 sm:p-14 bg-slate-900 text-white overflow-hidden">
        {/* Background stylized architectural grid & gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 opacity-90 z-0"></div>
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80")`
          }}
        ></div>

        <div className="relative z-10">
          <div className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-base">
              🏠
            </span>
            <span>Estate<span className="text-blue-400">Hub</span></span>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mt-8 mb-2">
            FIND YOUR DREAM HOME
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Better Homes.<br />
            <span className="text-blue-400">Bigger Dreams.</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-4 max-w-lg leading-relaxed">
            Buy, sell, explore verified properties with ease. EstateHub brings users, brokers, and comprehensive AI property intelligence together on one smart, trustworthy platform.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold shrink-0">
              ✓
            </div>
            <div className="text-xs">
              <div className="font-bold text-white">Verified Listings</div>
              <div className="text-slate-400 text-[11px]">RERA & Deed Cleared</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold shrink-0">
              🏢
            </div>
            <div className="text-xs">
              <div className="font-bold text-white">Trusted Brokers</div>
              <div className="text-slate-400 text-[11px]">Direct Agency Access</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold shrink-0">
              🤖
            </div>
            <div className="text-xs">
              <div className="font-bold text-white">8 AI Modules</div>
              <div className="text-slate-400 text-[11px]">Cadastral & Seismic</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Login Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-2xl mx-auto mb-3">
              🏠
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
            <p className="text-xs text-slate-500">Sign in to your EstateHub workspace</p>
          </div>

          {/* Quick Demo Credentials Fill Pills */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 text-center uppercase tracking-wider">
              Quick Role Switch (Demo Accounts)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('User', 'rahul@gmail.com')}
                className={`p-2 rounded-lg text-[11px] font-semibold border transition-all ${
                  role === 'User'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                👤 Buyer (User)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('Broker', 'broker@estatehub.com')}
                className={`p-2 rounded-lg text-[11px] font-semibold border transition-all ${
                  role === 'Broker'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🏢 Broker
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('Admin', 'admin@estatehub.com')}
                className={`p-2 rounded-lg text-[11px] font-semibold border transition-all ${
                  role === 'Admin'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ⚙️ Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs bg-white text-slate-900 font-medium"
              >
                <option value="User">👤 Buyer / Investor (User)</option>
                <option value="Broker">🏢 Property Broker / Agent</option>
                <option value="Admin">⚙️ Platform Administrator</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@estatehub.com"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Log In to Dashboard
            </button>
          </form>

          <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Secure 256-bit EstateHub Session Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
