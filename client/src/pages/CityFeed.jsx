import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import AlertCard from '../components/AlertCard';
import {
    Radio, Bell, Filter, Megaphone, AlertTriangle, Zap, Droplets,
    Car, Construction, Wind, CloudRain, MoreHorizontal, RefreshCw,
    BarChart3, ShieldAlert, Clock, CheckCircle2,
} from 'lucide-react';

const CATEGORIES = ['', 'traffic', 'water', 'power', 'drainage', 'construction', 'pollution', 'other'];
const SEVERITIES = ['', 'info', 'warning', 'critical'];

const CAT_ICON_MAP = {
    traffic: Car, water: Droplets, power: Zap, drainage: CloudRain,
    construction: Construction, pollution: Wind, other: MoreHorizontal,
};

const PRIORITY_BADGE = {
    low: 'bg-slate-100 text-slate-700 border-slate-200',
    medium: 'bg-blue-50 text-blue-700 border-blue-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-rose-50 text-rose-700 border-rose-200',
};

function timeAgo(date) {
    const diff = (Date.now() - new Date(date).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function CityFeed() {
    const { user } = useAuth();
    const { socket } = useSocket();
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [summary, setSummary] = useState({ totalActiveAlerts: 0, totalAnnouncements: 0, alertsByCategory: [], alertsBySeverity: [] });
    const [loading, setLoading] = useState(true);
    const [catFilter, setCatFilter] = useState('');
    const [sevFilter, setSevFilter] = useState('');
    const [activeTab, setActiveTab] = useState('alerts');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (catFilter) params.set('category', catFilter);
            if (sevFilter) params.set('severity', sevFilter);

            const [alertsRes, announcementsRes, summaryRes] = await Promise.all([
                api.get(`/feed/alerts?${params}`),
                api.get('/feed/announcements'),
                api.get('/feed/summary'),
            ]);
            setAlerts(alertsRes.data || []);
            setAnnouncements(announcementsRes.data || []);
            setSummary(summaryRes.data || {});
        } finally {
            setLoading(false);
        }
    }, [catFilter, sevFilter]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Real-time Socket.IO updates
    useEffect(() => {
        if (!socket) return;

        const handleNewAlert = (data) => {
            setAlerts(prev => [data, ...prev]);
            setSummary(prev => ({ ...prev, totalActiveAlerts: prev.totalActiveAlerts + 1 }));
        };
        const handleUpdatedAlert = (data) => {
            setAlerts(prev => prev.map(a => a._id === data._id ? data : a));
        };
        const handleResolvedAlert = (data) => {
            setAlerts(prev => prev.filter(a => a._id !== data._id));
            setSummary(prev => ({ ...prev, totalActiveAlerts: Math.max(0, prev.totalActiveAlerts - 1) }));
        };
        const handleNewAnnouncement = (data) => {
            setAnnouncements(prev => [data, ...prev]);
        };

        socket.on('city_alert_new', handleNewAlert);
        socket.on('city_alert_updated', handleUpdatedAlert);
        socket.on('city_alert_resolved', handleResolvedAlert);
        socket.on('announcement_new', handleNewAnnouncement);

        return () => {
            socket.off('city_alert_new', handleNewAlert);
            socket.off('city_alert_updated', handleUpdatedAlert);
            socket.off('city_alert_resolved', handleResolvedAlert);
            socket.off('announcement_new', handleNewAnnouncement);
        };
    }, [socket]);

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const warningCount = alerts.filter(a => a.severity === 'warning').length;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-6xl">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-widest mb-2.5">
                            <Radio size={13} className="animate-pulse" />
                            <span>Real-Time Broadcast Network</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                            City Live Feed
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Live telemetry notifications &amp; official municipal corporation announcements
                        </p>
                    </div>

                    <button
                        onClick={fetchData}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-orange-300 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-600 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin text-orange-600' : 'text-orange-600'} />
                        <span>Refresh Stream</span>
                    </button>
                </div>

                {/* Live Summary Metric Tiles */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Alerts</span>
                            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
                                <ShieldAlert size={16} />
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold font-mono text-rose-600 mb-1">{summary.totalActiveAlerts}</p>
                        <p className="text-[11px] text-slate-400">City-wide active issues</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical</span>
                            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
                                <AlertTriangle size={16} />
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold font-mono text-amber-600 mb-1">{criticalCount}</p>
                        <p className="text-[11px] text-slate-400">Requires urgent dispatch</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Warnings</span>
                            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                                <BarChart3 size={16} />
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold font-mono text-blue-600 mb-1">{warningCount}</p>
                        <p className="text-[11px] text-slate-400">Monitored closely</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Broadcasts</span>
                            <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                                <Megaphone size={16} />
                            </div>
                        </div>
                        <p className="text-3xl font-extrabold font-mono text-orange-600 mb-1">{summary.totalAnnouncements}</p>
                        <p className="text-[11px] text-slate-400">Gov official notices</p>
                    </motion.div>
                </div>

                {/* Category Filter Chips */}
                {summary.alertsByCategory?.length > 0 && (
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Filter by Category</p>
                        <div className="flex flex-wrap gap-2">
                            {summary.alertsByCategory.map(cat => {
                                const CatIcon = CAT_ICON_MAP[cat._id] || MoreHorizontal;
                                const isSelected = catFilter === cat._id;
                                return (
                                    <button
                                        key={cat._id}
                                        onClick={() => setCatFilter(isSelected ? '' : cat._id)}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-md shadow-orange-500/25'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        <CatIcon size={14} />
                                        <span>{cat._id.charAt(0).toUpperCase() + cat._id.slice(1)}</span>
                                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                            {cat.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('alerts')}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                            activeTab === 'alerts'
                                ? 'text-[#ea580c] border-[#ea580c]'
                                : 'text-slate-500 border-transparent hover:text-slate-800'
                        }`}
                    >
                        <AlertTriangle size={16} />
                        <span>Active Alerts</span>
                        <span className="text-[10px] font-mono bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                            {alerts.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('announcements')}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                            activeTab === 'announcements'
                                ? 'text-[#ea580c] border-[#ea580c]'
                                : 'text-slate-500 border-transparent hover:text-slate-800'
                        }`}
                    >
                        <Megaphone size={16} />
                        <span>Announcements</span>
                        <span className="text-[10px] font-mono bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                            {announcements.length}
                        </span>
                    </button>
                </div>

                {/* ALERTS TAB */}
                {activeTab === 'alerts' && (
                    <div>
                        {/* Filters */}
                        <div className="flex items-center gap-3 mb-6 flex-wrap">
                            <Filter size={15} className="text-orange-600" />
                            <select
                                value={catFilter}
                                onChange={(e) => setCatFilter(e.target.value)}
                                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-800 outline-none"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c ? c.charAt(0).toUpperCase() + c.slice(1) : 'All Categories'}</option>)}
                            </select>
                            <select
                                value={sevFilter}
                                onChange={(e) => setSevFilter(e.target.value)}
                                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-800 outline-none"
                            >
                                {SEVERITIES.map(s => <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Severity'}</option>)}
                            </select>
                            {(catFilter || sevFilter) && (
                                <button
                                    onClick={() => { setCatFilter(''); setSevFilter(''); }}
                                    className="text-xs text-orange-600 hover:text-orange-700 font-bold cursor-pointer"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => <div key={i} className="rounded-2xl h-24 bg-slate-200/60 animate-pulse" />)}
                            </div>
                        ) : alerts.length === 0 ? (
                            <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-sm max-w-md mx-auto">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                                    <CheckCircle2 size={28} />
                                </div>
                                <h3 className="text-base font-bold text-[#0F172A] mb-1">All Clear in Your Ward!</h3>
                                <p className="text-xs text-slate-500">No active city alerts right now. Systems are operational.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {alerts.map((alert, index) => (
                                    <motion.div
                                        key={alert._id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25, delay: index * 0.04 }}
                                    >
                                        <AlertCard alert={alert} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ANNOUNCEMENTS TAB */}
                {activeTab === 'announcements' && (
                    <div>
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => <div key={i} className="rounded-2xl h-24 bg-slate-200/60 animate-pulse" />)}
                            </div>
                        ) : announcements.length === 0 ? (
                            <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-sm max-w-md mx-auto">
                                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-4 text-orange-600">
                                    <Megaphone size={28} />
                                </div>
                                <h3 className="text-base font-bold text-[#0F172A] mb-1">No Broadcasts</h3>
                                <p className="text-xs text-slate-500">No official announcements from municipal corporation.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {announcements.map((ann, index) => (
                                    <motion.div
                                        key={ann._id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25, delay: index * 0.04 }}
                                        className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-orange-200 shadow-sm transition-all"
                                    >
                                        <div className="flex items-start gap-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0 text-orange-600">
                                                <Megaphone size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                    <h3 className="text-sm font-bold text-[#0F172A]">{ann.title}</h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${PRIORITY_BADGE[ann.priority] || PRIORITY_BADGE.low}`}>
                                                        {ann.priority}
                                                    </span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                                                        {ann.category}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-600 leading-relaxed mb-3">{ann.body}</p>
                                                <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
                                                    <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo(ann.createdAt)}</span>
                                                    {ann.createdBy?.name && <span>By {ann.createdBy.name}</span>}
                                                    {ann.expiresAt && <span>Valid until: {new Date(ann.expiresAt).toLocaleDateString('en-IN')}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
