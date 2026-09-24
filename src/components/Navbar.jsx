import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Compass, 
  PlusCircle, 
  FileCheck2, 
  LayoutDashboard, 
  Menu, 
  X,
  Lock,
  UserCheck
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Authority mode state persisted in localStorage
  const [isAuthority, setIsAuthority] = useState(() => {
    return localStorage.getItem('lostfound_authority') === 'true';
  });
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Browse', path: '/browse', icon: Compass },
    { label: 'Claims', path: '/claims', icon: FileCheck2 },
    ...(isAuthority ? [{ label: 'Dashboard', path: '/admin', icon: LayoutDashboard }] : []),
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === 'admin123' || pinInput === 'security') {
      localStorage.setItem('lostfound_authority', 'true');
      setIsAuthority(true);
      setPinModalOpen(false);
      setPinInput('');
      setPinError('');
      window.dispatchEvent(new Event('authority_mode_changed'));
    } else {
      setPinError('Invalid Security PIN. Access denied.');
    }
  };

  const handleLogoutAuthority = () => {
    localStorage.removeItem('lostfound_authority');
    setIsAuthority(false);
    window.dispatchEvent(new Event('authority_mode_changed'));
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  LostFound<span className="text-indigo-600">+</span>
                </span>
                <span className="hidden sm:block text-[9px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                  Campus Recovery Ops
                </span>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                      active
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions & Role Switcher */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthority ? (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    Security Desk
                  </span>
                  <button
                    onClick={handleLogoutAuthority}
                    title="Switch to Student View"
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 ml-1 underline font-medium"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setPinError('');
                    setPinInput('');
                    setPinModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Officer Login
                </button>
              )}

              <Link
                to="/report"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-200 transition"
              >
                <PlusCircle className="w-4 h-4" />
                Report Item
              </Link>
            </div>

            {/* Mobile hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {isAuthority ? (
                <button
                  onClick={() => {
                    handleLogoutAuthority();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-3 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200"
                >
                  Exit Officer Mode
                </button>
              ) : (
                <button
                  onClick={() => {
                    setPinError('');
                    setPinInput('');
                    setPinModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold"
                >
                  Officer Login
                </button>
              )}
              <Link
                to="/report"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow"
              >
                + Report Item
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Officer Passkey Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Lock className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Campus Authority Access</h3>
              </div>
              <button
                onClick={() => setPinModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Approval and claim settlement are restricted to authorized Campus Security & Admin desk personnel.
            </p>

            {pinError && (
              <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {pinError}
              </div>
            )}

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Security Passkey
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter officer PIN..."
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPinModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Unlock Authority View
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}