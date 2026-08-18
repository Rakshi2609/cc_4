import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import {
    BarChart3, Activity, Users, ShieldCheck, Flame,
    ChevronRight, TrendingUp, AlertTriangle, ArrowLeft,
    Calendar, Map as MapIcon, RefreshCw, BarChart, Sparkles
} from 'lucide-react';

export default function GovAnalytics() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [kavachData, setKavachData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const [overview, kavach] = await Promise.all([
                api.get('/analytics/overview'),
                api.get('/analytics/kavach-overview')
            ]);
            setData(overview.data);
            setKavachData(kavach.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading && !data) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-mono text-xs text-slate-400 animate-pulse">
                SYNCING CITY ANALYTICS ENGINE...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-slate-200/90 px-6 py-4 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/gov-dashboard')}
                            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600 cursor-pointer"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="w-9 h-9 bg-gradient-to-tr from-[#ea580c] to-[#f97316] rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/25">
                            <BarChart3 size={18} />
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold text-[#0F172A] tracking-tight">City Intelligence Analytics</h1>
                            <p className="text-xs text-slate-500">Government Decision Support &amp; Ward Resilience</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchAnalytics}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-orange-300 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-600 transition-all cursor-pointer shadow-sm"
                    >
                        <RefreshCw size={13} className={loading ? 'animate-spin text-orange-600' : 'text-orange-600'} />
                        <span>Refresh Telemetry</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'RESOLUTION RATE', value: `${data?.resolutionRate}%`, sub: 'Current month SLA', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
                        { label: 'AVG RESPONSE', value: `${data?.avgResponseDays} days`, sub: 'Target: 3 days', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50 text-orange-600 border-orange-200' },
                        { label: 'AVG SEVERITY', value: data?.avgSeverityScore?.toFixed(1), sub: 'Out of 100 max', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50 text-amber-600 border-amber-200' },
                        { label: 'ACTIVE ALERTS', value: data?.activeAlerts, sub: 'Traffic &amp; Utility', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 text-rose-600 border-rose-200' },
                    ].map((kpi, i) => (
                        <div key={i} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{kpi.label}</span>
                                <div className={`p-2 rounded-xl border ${kpi.bg}`}>
                                    <kpi.icon size={15} />
                                </div>
                            </div>
                            <div className={`text-3xl font-extrabold font-mono tracking-tight ${kpi.color} mb-1`}>{kpi.value}</div>
                            <p className="text-[11px] text-slate-400" dangerouslySetInnerHTML={{ __html: kpi.sub }} />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* City Resilience Index (CHI) Card */}
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-emerald-600" /> City Resilience Index
                                </h3>
                                <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    NOMINAL
                                </span>
                            </div>

                            <div className="flex flex-col items-center my-4">
                                <div className="w-40 h-40 rounded-full border-[10px] border-slate-100 flex items-center justify-center relative shadow-inner">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle
                                            cx="80" cy="80" r="70"
                                            fill="transparent"
                                            stroke="#ea580c"
                                            strokeWidth="10"
                                            strokeDasharray={2 * Math.PI * 70}
                                            strokeDashoffset={2 * Math.PI * 70 * (1 - (kavachData?.cityHealthIndex || 78) / 100)}
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <div className="text-center z-10">
                                        <p className="text-4xl font-extrabold text-[#0F172A] font-mono">{kavachData?.cityHealthIndex || 78}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Health Score</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
                                <p className="text-[10px] font-bold uppercase text-slate-500">Active Wards</p>
                                <p className="text-lg font-bold font-mono text-slate-900 mt-0.5">{kavachData?.wardCount || 10}</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
                                <p className="text-[10px] font-bold uppercase text-slate-500">Status</p>
                                <p className="text-sm font-bold font-mono text-emerald-600 mt-1">OPERATIONAL</p>
                            </div>
                        </div>
                    </div>

                    {/* Real-Time Resource Demand */}
                    <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 uppercase tracking-wide">
                                    <TrendingUp size={18} className="text-orange-600" /> Real-Time Ward Utility Load
                                </h3>
                                <span className="text-[10px] font-mono px-2.5 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 font-bold rounded-full">
                                    LIVE SENSOR TELEMETRY
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                                {kavachData?.resourceAverages && Object.entries(kavachData.resourceAverages).map(([res, val]) => (
                                    <div key={res} className="space-y-1.5">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{res} Load</span>
                                            <span className={`text-xs font-mono font-bold ${val > 80 ? 'text-rose-600' : 'text-orange-600'}`}>{val}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${val > 80 ? 'bg-rose-500' : 'bg-[#ea580c]'} transition-all duration-1000 ease-out`}
                                                style={{ width: `${val}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                                            <span>Current: {val}%</span>
                                            <span>Safety Limit: 100%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Smart Cities Automated Balancing Feed</span>
                            <span className="text-emerald-600 font-bold font-mono">99.8% System Health</span>
                        </div>
                    </div>

                </div>

                {/* Congestion Hotspots & Ward Density */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-[#0F172A] mb-4 uppercase tracking-wide flex items-center gap-2">
                            <Flame size={18} className="text-orange-600" /> Active Traffic Hotspots
                        </h3>
                        <div className="divide-y divide-slate-100">
                            {data?.congestionZones?.length === 0 ? (
                                <p className="py-8 text-center text-xs font-mono text-slate-400">NO ACTIVE CONGESTION</p>
                            ) : data?.congestionZones?.map((zone, i) => (
                                <div key={i} className="py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-slate-400 w-5">#{i + 1}</span>
                                        <div>
                                            <p className="text-xs font-bold text-[#0F172A]">{zone._id || 'Unknown Ward'}</p>
                                            <p className="text-[10px] text-slate-500">{zone.count} Active Alerts</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full ${zone.latestSeverity === 'critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                                        {zone.latestSeverity?.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-[#0F172A] mb-4 uppercase tracking-wide flex items-center gap-2">
                            <MapIcon size={18} className="text-blue-600" /> Ward Issue Density
                        </h3>
                        <div className="space-y-2.5">
                            {data?.zoneHotspots?.slice(0, 5).map((zone, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-mono text-xs font-bold">
                                        {zone.count}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-[#0F172A] truncate">{zone._id}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">LAT: {zone.avgLat?.toFixed(3)}° LNG: {zone.avgLng?.toFixed(3)}°</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
