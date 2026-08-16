import React, { useState } from 'react';
import {
  Building2, Headphones, User, ClipboardList,
  Mail, Lock, Eye, EyeOff, ShieldCheck, BarChart2, Activity,
  CircleCheckBig
} from 'lucide-react';

interface LoginProps {
  onLogin: (userType: 'hospital' | 'support' | 'customer' | 'distributor', username: string, password: string) => Promise<boolean>;
}

const portalTabs = [
  { key: 'hospital' as const,     label: 'Hospital',    icon: Building2 },
  { key: 'support' as const,      label: 'Support',     icon: Headphones },
  { key: 'customer' as const,     label: 'Customer',    icon: User },
  { key: 'distributor' as const,  label: 'Classifier',  icon: ClipboardList },
];

const demoCredentials = {
  hospital:    { username: 'cityhospital',  password: 'hospital123' },
  support:     { username: 'admin',         password: 'admin123' },
  customer:    { username: 'customer',      password: 'customer123' },
  distributor: { username: 'distributor',   password: 'distributor123' },
};

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure Platform',
    desc: 'Enterprise-grade encryption with HIPAA-compliant data protection for every patient record.',
  },
  {
    icon: BarChart2,
    title: 'Real-Time Analytics',
    desc: 'Live bed occupancy, stock levels, and revenue dashboards updated every 30 seconds.',
  },
  {
    icon: Activity,
    title: 'Patient Monitoring',
    desc: 'Integrated vitals tracking and alert escalation across all wards from one interface.',
  },
];

export default function Login({ onLogin }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'hospital' | 'support' | 'customer' | 'distributor'>('hospital');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleTabSwitch = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCredentials({ username: '', password: '' });
    setError('');
  };

  const handleQuickAccess = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCredentials(demoCredentials[tab]);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await onLogin(activeTab, credentials.username, credentials.password);
      if (!success) setError('Invalid credentials. Please try again.');
    } catch {
      setError('Unable to connect. Please use the demo credentials below.');
    } finally {
      setLoading(false);
    }
  };

  const demo = demoCredentials[activeTab];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 30% 50%, #1e3461 0%, #111c38 60%, #0d1628 100%)' }}
    >
      {/* Card */}
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row" style={{ minHeight: 600 }}>

        {/* ── LEFT PANEL ── */}
        <div
          className="relative md:w-[44%] flex flex-col justify-between p-10 overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #1a2f5c 0%, #112045 100%)' }}
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white/5" />
          <div className="pointer-events-none absolute -top-8 -right-8 w-44 h-44 rounded-full border border-white/5" />
          <div className="pointer-events-none absolute bottom-20 -left-20 w-72 h-72 rounded-full border border-white/5" />

          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #c9940a, #e8b820)' }}
              >
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none tracking-wide">MediConnect</p>
                <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mt-0.5">Hospital OS</p>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-white text-3xl font-bold leading-tight mb-4">
              Connecting care,{' '}
              <span style={{ color: '#e0a820' }}>one hospital</span> at a time.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              A unified platform for hospitals and healthcare providers to manage patients, staff, stock, and billing from a single dashboard.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(201,148,10,0.15)', border: '1px solid rgba(201,148,10,0.25)' }}
                  >
                    <Icon size={16} style={{ color: '#e0a820' }} />
                  </div>
                  <div>
                    <p className="text-white/90 text-sm font-semibold">{title}</p>
                    <p className="text-white/40 text-xs leading-relaxed mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 pt-6 border-t border-white/10 flex gap-8">
            {[['140+', 'Hospitals'], ['2.4M', 'Patients'], ['99.9%', 'Uptime']].map(([val, lbl]) => (
              <div key={lbl}>
                <p className="text-white font-bold text-xl">{val}</p>
                <p className="text-white/40 text-xs mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className="flex-1 flex flex-col justify-center px-10 py-12"
          style={{ background: '#f7f3ed' }}
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-7">Sign in to your hospital dashboard</p>

          {/* Portal selector */}
          <div className="grid grid-cols-4 gap-3 mb-7">
            {portalTabs.map(({ key, label, icon: Icon }) => {
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => handleQuickAccess(key)}
                  className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl border transition-all"
                  style={{
                    background: active ? '#fff' : '#fff',
                    borderColor: active ? '#1a2f5c' : '#e2ddd6',
                    boxShadow: active ? '0 2px 12px rgba(26,47,92,0.12)' : 'none',
                  }}
                >
                  <Icon
                    size={20}
                    style={{ color: active ? '#1a2f5c' : '#94918c' }}
                    strokeWidth={1.8}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: active ? '#1a2f5c' : '#94918c' }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-xs">or sign in manually</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="cityhospital"
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-white outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-200 text-slate-800 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-slate-200 bg-white outline-none transition-all focus:border-slate-400 focus:ring-2 focus:ring-slate-200 text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded flex items-center justify-center cursor-pointer transition-colors"
                  style={{ background: rememberMe ? '#1a2f5c' : '#e2ddd6' }}
                >
                  {rememberMe && <div className="w-2 h-2 rounded-sm bg-white" />}
                </div>
                <span className="text-slate-500 text-sm">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ background: 'linear-gradient(135deg, #1a2f5c 0%, #243f7a 100%)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Demo credentials box */}
          <div
            className="mt-5 p-4 rounded-xl flex items-start gap-3"
            style={{ background: '#fdf3dc', border: '1px solid #f0d98a' }}
          >
            <CircleCheckBig size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#c9940a' }} />
            <p className="text-sm" style={{ color: '#7a5b0a' }}>
              <span className="font-semibold">Demo credentials —</span>{' '}
              Username:{' '}
              <code className="font-mono font-bold bg-amber-100 px-1 rounded">{demo.username}</code>{' '}
              Password:{' '}
              <code className="font-mono font-bold bg-amber-100 px-1 rounded">{demo.password}</code>
              <br />
              Or click <strong>{portalTabs.find(t => t.key === activeTab)?.label}</strong> above for instant access.
            </p>
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">
            {"Don't have an account? "}
            <button className="font-bold text-slate-700 hover:text-slate-900 transition-colors">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
