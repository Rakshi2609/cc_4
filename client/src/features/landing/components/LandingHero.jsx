import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Sparkles,
    ShieldCheck,
    MapPin,
    Zap,
    Cpu,
    CheckCircle2,
    Layers,
    Activity,
    Scan
} from 'lucide-react';

const LIVE_DEMO_ISSUES = [
    {
        title: 'Deep Road Crater & Asphalt Breach',
        category: 'Pothole',
        dept: 'Roads & Infrastructure',
        confidence: '99.2%',
        severity: 85,
        lat: '12.9716° N',
        lng: '77.5946° E',
        status: 'Auto-Routed to Ward 14 Crew',
        color: '#f97316',
        bg: 'rgba(249, 115, 22, 0.12)',
        borderColor: 'rgba(249, 115, 22, 0.3)'
    },
    {
        title: 'Main Pipeline Valve Burst',
        category: 'Water Leakage',
        dept: 'Water & Sanitation',
        confidence: '98.7%',
        severity: 94,
        lat: '12.9734° N',
        lng: '77.6012° E',
        status: 'High Priority Emergency Alert Triggered',
        color: '#0ea5e9',
        bg: 'rgba(14, 165, 233, 0.12)',
        borderColor: 'rgba(14, 165, 233, 0.3)'
    },
    {
        title: 'Uncollected Commercial Waste Dump',
        category: 'Garbage',
        dept: 'Solid Waste Management',
        confidence: '97.5%',
        severity: 72,
        lat: '12.9690° N',
        lng: '77.5890° E',
        status: 'Geo-Merged into 4-Citizen Hotspot',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.12)',
        borderColor: 'rgba(16, 185, 129, 0.3)'
    },
    {
        title: 'Damaged High-Mast LED Fixture',
        category: 'Streetlight',
        dept: 'Electricity Department',
        confidence: '98.1%',
        severity: 68,
        lat: '12.9780° N',
        lng: '77.6050° E',
        status: 'Dispatched to Night Patrol Unit',
        color: '#eab308',
        bg: 'rgba(234, 179, 8, 0.12)',
        borderColor: 'rgba(234, 179, 8, 0.3)'
    }
];

export const LandingHero = () => {
    const [issueIdx, setIssueIdx] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIssueIdx((prev) => (prev + 1) % LIVE_DEMO_ISSUES.length);
        }, 3600);
        return () => clearInterval(timer);
    }, []);

    const activeIssue = LIVE_DEMO_ISSUES[issueIdx];

    return (
        <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 overflow-hidden bg-[#0a0f1d]">
            {/* Background dynamic grid & ambient glows */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))] pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Subtle grid backdrop */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '48px 48px'
                }}
            />

            <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
                {/* 21st.dev Style Floating Pill Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-lg shadow-black/20 backdrop-blur-md mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-semibold text-slate-300 tracking-wide">
                        Mistral Vision AI &middot; Civic Intelligence v4.0
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 rounded-md">
                        LIVE
                    </span>
                </motion.div>

                {/* Main Hero Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                    className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6 max-w-4xl"
                >
                    Turn Citizen Photos into{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                        Immediate Civic Action
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                    className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
                >
                    Snap an infrastructure issue in 15 seconds. Mistral Pixtral Vision verifies the damage, auto-clusters duplicate reports, and dispatches municipal crews with zero red tape.
                </motion.p>

                {/* Hero CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-14"
                >
                    <Link
                        to="/register"
                        className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm sm:text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        <span>Report an Issue Now</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        to="/city-feed"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 font-medium text-sm sm:text-base backdrop-blur-sm transition-all duration-200 hover:border-slate-600"
                    >
                        <Activity size={17} className="text-blue-400" />
                        <span>Explore Live City Feed</span>
                    </Link>
                </motion.div>

                {/* 21st.dev Inspired Interactive Live Vision Inspection Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                    className="w-full max-w-3xl rounded-2xl bg-slate-900/70 border border-slate-800 shadow-2xl shadow-black/60 backdrop-blur-xl p-5 sm:p-6 text-left"
                >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                <Scan size={18} />
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Mistral Vision Neural Pipeline
                                </div>
                                <div className="text-sm font-semibold text-white">
                                    Live Image Verification Stream
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            <CheckCircle2 size={13} />
                            <span>SHA-256 Audit Ready</span>
                        </div>
                    </div>

                    {/* Animated Content Switcher */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIssue.title}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -12 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                        >
                            {/* Left Meta */}
                            <div className="md:col-span-8 space-y-2.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                                        style={{
                                            color: activeIssue.color,
                                            backgroundColor: activeIssue.bg,
                                            borderColor: activeIssue.borderColor
                                        }}
                                    >
                                        {activeIssue.category}
                                    </span>
                                    <span className="text-xs font-medium text-slate-400 bg-slate-800/70 px-2.5 py-0.5 rounded-full border border-slate-700/50">
                                        Dept: {activeIssue.dept}
                                    </span>
                                    <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                                        Confidence: {activeIssue.confidence}
                                    </span>
                                </div>

                                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                                    {activeIssue.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                    <span className="flex items-center gap-1 font-mono text-slate-300">
                                        <MapPin size={13} className="text-rose-400" />
                                        {activeIssue.lat}, {activeIssue.lng}
                                    </span>
                                    <span className="text-slate-600">&bull;</span>
                                    <span className="text-emerald-400 font-medium">
                                        {activeIssue.status}
                                    </span>
                                </div>
                            </div>

                            {/* Right Severity Metric */}
                            <div className="md:col-span-4 bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/70 flex flex-col justify-center">
                                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                                    <span>AI Severity Score</span>
                                    <span className="font-mono font-bold text-white text-sm">
                                        {activeIssue.severity}/100
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${activeIssue.severity}%` }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-500 rounded-full"
                                    />
                                </div>
                                <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                                    <span>Auto-Clustering Radius</span>
                                    <span className="font-mono text-slate-200">100m Active</span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Trust and Integration Strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                    <span className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                        <Cpu size={14} className="text-blue-400" /> Mistral Pixtral-12B
                    </span>
                    <span className="text-slate-700">&bull;</span>
                    <span className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                        <Layers size={14} className="text-indigo-400" /> GeoJSON Clustering
                    </span>
                    <span className="text-slate-700">&bull;</span>
                    <span className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                        <Zap size={14} className="text-amber-400" /> Socket.IO Realtime
                    </span>
                    <span className="text-slate-700">&bull;</span>
                    <span className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                        <ShieldCheck size={14} className="text-emerald-400" /> Tamper-Proof Audit
                    </span>
                </motion.div>
            </div>
        </section>
    );
};

export default LandingHero;
