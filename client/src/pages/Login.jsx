import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Shield, ArrowRight, CheckCircle2, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'government' ? '/gov-dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Soft Glows */}
      <div className="absolute top-10 left-1/4 w-[450px] h-[300px] bg-orange-100/40 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-blue-100/30 blur-[130px] rounded-full pointer-events-none" />

      {/* Dot Grid Backdrop */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 my-6">
        {/* Left Side: Brand Value Proposition */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-center space-y-6 pr-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-widest w-fit">
            <Shield size={13} />
            <span>CivicPlus Security</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Smart City Governance{' '}
            <span className="text-orange-600">at Your Fingertips</span>
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            Access your personalized municipal dashboard to report civic hazards, track live crew dispatches, and review AI-verified audit trails.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Mistral Vision AI verification',
              'Real-time municipal telemetry stream',
              'SHA-256 tamper-proof resolution history',
              '100m geo-clustering hotspot engine'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200/80 text-xs font-mono text-slate-500">
            Powered by Smart Cities Mission &bull; Digital India
          </div>
        </div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl shadow-slate-200/50 relative"
        >
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-1">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter your registered email and password to continue.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200">
              <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
              <p className="text-xs font-medium text-rose-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                  placeholder="name@domain.gov / citizen@mail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/25 transition-all duration-200 mt-2 cursor-pointer"
            >
              <LogIn size={17} />
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                Create a free account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
