import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';
import IssueMap from '../components/IssueMap';
import GeofenceBanner from '../components/GeofenceBanner';
import {
  MapPin,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Plus,
  Radio,
  Layers,
  Sparkles,
  Map as MapIcon
} from 'lucide-react';

const STATUSES = ['', 'pending', 'in-progress', 'resolved'];
const CATEGORIES = ['', 'Pothole', 'Streetlight', 'Garbage', 'Drainage', 'Water Leakage', 'Others'];

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [issues, setIssues] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [toast, setToast] = useState(searchParams.get('success') ? 'Issue submitted successfully!' : '');
  const [mapIssues, setMapIssues] = useState([]);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => { fetchMapIssues(); }, []);
  useEffect(() => { fetchIssues(); }, [statusFilter, categoryFilter, page]);

  const fetchMapIssues = async () => {
    try { const res = await api.get('/issues/map'); setMapIssues(res.data); } catch { /* ignore */ }
  };

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (statusFilter) params.set('status', statusFilter);
      if (categoryFilter) params.set('category', categoryFilter);
      const res = await api.get(`/issues/my?${params}`);
      setIssues(res.data.issues);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch { /* ignore */
    } finally { setLoading(false); }
  };

  const pending = issues.filter(i => i.status === 'pending').length;
  const inProgress = issues.filter(i => i.status === 'in-progress').length;
  const resolved = issues.filter(i => i.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <GeofenceBanner />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-7xl">

        {/* Toast Notification */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-5 py-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-medium shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>{toast}</span>
            </div>
            <button onClick={() => setToast('')} className="text-emerald-600 hover:text-emerald-800 text-xs font-bold">
              DISMISS
            </button>
          </motion.div>
        )}

        {/* Top Header & Quick Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-widest mb-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              <span>Citizen Grievance Redressal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              My Reports Hub
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back, <span className="font-bold text-slate-800">{user?.name}</span> &bull; Track municipal ticket resolution in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/city-feed"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <Radio size={16} className="text-orange-600" />
              <span>City Feed</span>
            </Link>

            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={16} />
              <span>Report New Issue</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Reports',
              value: total,
              icon: BarChart3,
              color: 'text-slate-900',
              bgIcon: 'bg-slate-100 text-slate-700 border-slate-200',
              description: 'All submitted tickets'
            },
            {
              label: 'Pending Review',
              value: pending,
              icon: AlertCircle,
              color: 'text-rose-600',
              bgIcon: 'bg-rose-50 text-rose-600 border-rose-200',
              description: 'Queued for dispatch'
            },
            {
              label: 'In Progress',
              value: inProgress,
              icon: Clock,
              color: 'text-amber-600',
              bgIcon: 'bg-amber-50 text-amber-600 border-amber-200',
              description: 'Crew on-site repairs'
            },
            {
              label: 'AI Resolved',
              value: resolved,
              icon: CheckCircle2,
              color: 'text-emerald-600',
              bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-200',
              description: 'Verified & completed'
            },
          ].map((s, index) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {s.label}
                </span>
                <div className={`p-2 rounded-xl border ${s.bgIcon}`}>
                  <s.icon size={16} />
                </div>
              </div>
              <div className={`text-3xl font-extrabold font-mono tracking-tight ${s.color} mb-1`}>
                {s.value}
              </div>
              <p className="text-[11px] text-slate-400">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Map Container */}
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">Ward Issue Heatmap</h3>
                <p className="text-xs text-slate-500">Live geospatial coordinates of reported hazards</p>
              </div>
            </div>

            <button
              onClick={() => setShowMap(v => !v)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#0F172A] border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapIcon size={14} />
              <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
            </button>
          </div>

          <AnimatePresence>
            {showMap && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="h-80 sm:h-96 w-full relative"
              >
                <IssueMap issues={mapIssues} title="City Ward Telemetry" readOnly />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Filter size={18} className="text-orange-600" />
              <span className="text-sm font-bold text-slate-800">Filter Submissions</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Select */}
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-slate-50 text-slate-800 outline-none transition-colors cursor-pointer"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>
                    {s ? s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ') : 'All Statuses'}
                  </option>
                ))}
              </select>

              {/* Category Select */}
              <select
                value={categoryFilter}
                onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-slate-50 text-slate-800 outline-none transition-colors cursor-pointer"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c || 'All Categories'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
              Reported Tickets{' '}
              {total > 0 && (
                <span className="text-xs font-mono text-slate-500 font-semibold ml-2 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                  {total} Active
                </span>
              )}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl h-80 bg-slate-200/60 animate-pulse" />
              ))}
            </div>
          ) : issues.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-sm max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-5 text-orange-600">
                <MapPin size={28} />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1.5">No Reports Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                {statusFilter || categoryFilter
                  ? 'No issues match the selected filters. Try resetting the filters.'
                  : 'You have not submitted any civic reports yet. Help improve your ward today!'}
              </p>
              {!statusFilter && !categoryFilter && (
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 transition-all"
                >
                  <Plus size={16} />
                  <span>Submit Your First Report</span>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {issues.map((issue, index) => (
                  <motion.div
                    key={issue._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                  >
                    <IssueCard issue={issue} />
                  </motion.div>
                ))}
              </div>

              {/* Numbered Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                  >
                    <ChevronLeft size={16} className="text-slate-600" />
                  </button>

                  <div className="flex gap-1.5">
                    {[...Array(pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                          page === i + 1
                            ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-md shadow-orange-500/25'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                  >
                    <ChevronRight size={16} className="text-slate-600" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
