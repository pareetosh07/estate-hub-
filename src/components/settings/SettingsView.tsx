import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Shield, Key, Bell, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, setCurrentUser, userRole } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98220 12345');
  const [loginProtection, setLoginProtection] = useState(true);
  const [activityLogging, setActivityLogging] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      email,
      phone
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Account & Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your personal credentials, contact details, and role permissions.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile configuration updated successfully!</span>
        </div>
      )}

      {/* User Profile Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Personal Information
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Mobile Contact</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Account Role</label>
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                {currentUser.role} (Assigned in Database)
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Security Preferences (Preserved from Streamlit settings) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Security & Compliance Safeguards
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={loginProtection}
              onChange={(e) => setLoginProtection(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 mt-0.5"
            />
            <div>
              <div className="font-semibold text-slate-800">Enable session login protection</div>
              <p className="text-[11px] text-slate-500">
                Enforces CSRF origin verification and automated session timeout on idle windows.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={activityLogging}
              onChange={(e) => setActivityLogging(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 mt-0.5"
            />
            <div>
              <div className="font-semibold text-slate-800">Enable admin activity audit logging</div>
              <p className="text-[11px] text-slate-500">
                Records property approval, user blocking, and document download timestamps into immutable log files.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={requireApproval}
              onChange={(e) => setRequireApproval(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 mt-0.5"
            />
            <div>
              <div className="font-semibold text-slate-800">Require administrator approval before listing publish</div>
              <p className="text-[11px] text-slate-500">
                New listings posted by brokers or sellers remain in Pending status until cleared by an administrator.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
