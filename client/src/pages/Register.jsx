import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Shield, User, AlertCircle, ArrowRight, CheckCircle2, Lock, Mail, Phone } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = form.role === 'government' ? '/auth/create-gov' : '/auth/register';
      const res = await api.post(endpoint, form);
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'government' ? '/gov-dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        {/* Left Side: Citizen Empowerment Info */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-center space-y-6 pr-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-widest w-fit">
            <UserPlus size={13} />
            <span>Join 10,000+ Citizens</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Fix Your City with{' '}
            <span className="text-orange-600">AI-Powered Proof</span>
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            Report infrastructure defects in 15 seconds. Get instant push notifications on status updates, and participate in community grievance upvoting.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'GPS location auto-tagging',
              'Auto-clustering of duplicate tickets',
              'Direct routing to municipal ward councilors',
              'Cryptographic SHA-256 resolution log'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200/80 text-xs font-mono text-slate-500">
            Official Smart Cities Grievance Redressal Portal
          </div>
        </div>

        {/* Right Side: Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 relative"
        >
          {/* Header */}
          <div className="mb-5">
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-1">
              Create an Account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select your role and fill in your details to get started.
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              ['citizen', User, 'Citizen', 'Report and track issues'],
              ['government', Shield, 'Municipal Official', 'Administer and resolve']
            ].map(([role, Icon, title, description]) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ ...form, role })}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  form.role === role
                    ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className={form.role === role ? 'text-orange-600' : 'text-slate-500'} />
                  <span className={`text-xs font-bold ${form.role === role ? 'text-orange-950' : 'text-slate-800'}`}>
                    {title}
                  </span>
                </div>
                <p className={`text-[11px] leading-tight ${form.role === role ? 'text-orange-800' : 'text-slate-500'}`}>
                  {description}
                </p>
              </button>
            ))}
          </div>

          {form.role === 'government' && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
              <Shield size={16} className="text-amber-600 flex-shrink-0" />
              <span><strong>Official Notice:</strong> Government accounts are granted command hub permissions upon creation.</span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200">
              <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
              <p className="text-xs font-medium text-rose-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                  placeholder="e.g. Aarav Sharma"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                  placeholder="Create password (min. 6 chars)"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/25 transition-all duration-200 mt-3 cursor-pointer"
            >
              <UserPlus size={17} />
              <span>{loading ? 'Registering...' : 'Create Account & Continue'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
