import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera,
    MapPin,
    BarChart3,
    Bell,
    Shield,
    Users,
    Briefcase,
    Activity,
    Layers,
    Cpu,
    CheckCircle,
    ArrowUpRight,
    Sliders,
    Flame,
    Lock,
    Building2,
    Wrench,
    Smartphone
} from 'lucide-react';

const GOVT_SHOWCASE_CARDS = [
    {
        title: 'Integrated Command & Control Center (ICCC)',
        badge: 'Smart Cities Mission',
        badgeColor: 'text-orange-700 bg-orange-50 border-orange-200/80',
        desc: 'Civil officers and municipal engineers monitor multi-screen video walls displaying real-time ward telemetry, GIS heatmaps, and automated AI fault dispatches.',
        image: '/images/command_center.jpg',
        stats: '24/7 Ward Monitoring &bull; 99.4% Uptime',
        icon: Building2
    },
    {
        title: 'On-Ground Municipal Engineering Dispatch',
        badge: 'Municipal Corporation Ops',
        badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
        desc: 'Field maintenance teams receive AI-generated 4-step work plans, execute road/pothole surfacing, and submit resolution photos for automated verification.',
        image: '/images/road_crew.jpg',
        stats: '4-Step Work Plans &bull; Instant SLA Routing',
        icon: Wrench
    },
    {
        title: 'Citizen Mobile Grievance Redressal',
        badge: 'Digital India & Swachh Bharat',
        badgeColor: 'text-blue-700 bg-blue-50 border-blue-200/80',
        desc: 'Residents capture infrastructure hazards with pinpoint GPS. Mistral Vision AI validates category and severity before routing to the exact ward councilor.',
        image: '/images/citizen_reporting.jpg',
        stats: '15-Sec Submission &bull; 100m Auto-Merge',
        icon: Smartphone
    }
];

export const BenefitsSection = () => {
    const [portalTab, setPortalTab] = useState('citizen'); // 'citizen' | 'government'

    return (
        <section className="bg-[#F8FAFC] py-24 px-4 sm:px-6 lg:px-8 text-slate-800 relative overflow-hidden">
            {/* Ambient Light Accents */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-100/40 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-100/40 blur-[140px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto">
                {/* ─── REAL GOVT SHOWCASE (Indian Smart City Operations) ─── */}
                <div className="mb-24">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-widest mb-4"
                        >
                            <Building2 size={13} />
                            <span>Digital India &bull; Smart Cities Mission</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] mb-4"
                        >
                            Empowering Indian Municipalities
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-600 text-base sm:text-lg leading-relaxed"
                        >
                            Connecting municipal corporation control rooms, on-ground road engineering squads, and everyday citizens under a unified smart governance architecture.
                        </motion.p>
                    </div>

                    {/* 3 Showcase Cards with Real Indian Govt Photos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {GOVT_SHOWCASE_CARDS.map((card, idx) => {
                            const IconComponent = card.icon;
                            return (
                                <motion.div
                                    key={card.title}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                                    className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:border-orange-300 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl"
                                >
                                    {/* Image with zoom effect */}
                                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md ${card.badgeColor}`}>
                                                <IconComponent size={12} />
                                                {card.badge}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-orange-600 transition-colors">
                                                {card.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                                                {card.desc}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                                            <span dangerouslySetInnerHTML={{ __html: card.stats }} />
                                            <ArrowUpRight size={14} className="text-slate-400 group-hover:text-orange-600 transition-colors" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Section Header for Bento Grid */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <Cpu size={13} className="text-orange-500" />
                        <span>Core Architecture</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F172A] mb-4"
                    >
                        Built for Speed, Trust, and Scale
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 text-base sm:text-lg leading-relaxed"
                    >
                        From computer vision image audits to geo-spatial deduplication, every layer of CivicPlus is designed to eliminate municipal delays.
                    </motion.p>
                </div>

                {/* 21st.dev Style Clean Light Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-24">
                    {/* BENTO CARD 1: Mistral Vision Auto-Categorizer (Spans 7 cols) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-7 rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between group hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200/60 text-orange-600">
                                <Cpu size={22} />
                            </div>
                            <span className="text-xs font-mono text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                                Mistral Pixtral Vision
                            </span>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-2">
                                Instant AI Image Classification
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Upload a photo and Mistral Vision analyzes pixel textures to detect potholes, water leakages, garbage overflow, or broken streetlights with 98%+ confidence before auto-assigning the appropriate municipal department.
                            </p>
                        </div>

                        {/* Scan Simulation Widget */}
                        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 relative">
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
                                <span>Vision Pipeline Output</span>
                                <span className="text-emerald-600 font-bold">VALIDATED ISSUE</span>
                            </div>
                            <div className="space-y-1.5 font-mono text-xs text-slate-700">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Detected:</span>
                                    <span className="text-[#0F172A] font-bold">Pothole (Category #1)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Dept Target:</span>
                                    <span className="text-orange-600 font-semibold">Roads &amp; Infrastructure</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Authenticity:</span>
                                    <span className="text-emerald-600 font-semibold">99.4% Verified Real Photo</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* BENTO CARD 2: 100m Geo-Clustering Hotspot Engine (Spans 5 cols) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between group hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-600">
                                <MapPin size={22} />
                            </div>
                            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                100m Geo-Proximity
                            </span>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-2">
                                Smart Hotspot Auto-Merge
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                When multiple citizens report the same issue, our geospatial engine merges them into a single primary ticket, automatically increasing its priority weight.
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm">
                                    4x
                                </div>
                                <div className="text-xs">
                                    <div className="font-bold text-[#0F172A]">Cluster Multiplier</div>
                                    <div className="text-slate-500">Merged 4 duplicate citizen alerts</div>
                                </div>
                            </div>
                            <Flame size={20} className="text-orange-500 animate-pulse" />
                        </div>
                    </motion.div>

                    {/* BENTO CARD 3: Dynamic Severity Matrix (Spans 4 cols) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="md:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 relative overflow-hidden flex flex-col justify-between group hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <div>
                            <div className="p-3 w-fit rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600 mb-5">
                                <Sliders size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                                Dynamic Priority Matrix
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Combines AI severity base scores, upvote surges, cluster volume, and aging days to ensure critical hazards jump to the top.
                            </p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                            <code>Priority = Base + AI(15) + (Cluster &times; 5)</code>
                        </div>
                    </motion.div>

                    {/* BENTO CARD 4: Real-Time Socket Notifications (Spans 4 cols) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 relative overflow-hidden flex flex-col justify-between group hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <div>
                            <div className="p-3 w-fit rounded-xl bg-purple-50 border border-purple-200/60 text-purple-600 mb-5">
                                <Bell size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                                Socket.IO Live Alerts
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Zero polling. Instant push notifications update the citizen and all cluster subscribers the second an engineer accepts or resolves a ticket.
                            </p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs text-slate-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="font-semibold text-slate-800">Live Status Push Active</span>
                        </div>
                    </motion.div>

                    {/* BENTO CARD 5: Immutable SHA-256 Audit Trail (Spans 4 cols) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 }}
                        className="md:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 relative overflow-hidden flex flex-col justify-between group hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <div>
                            <div className="p-3 w-fit rounded-xl bg-blue-50 border border-blue-200/60 text-blue-600 mb-5">
                                <Lock size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                                Immutable Audit History
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Cryptographic status logs prevent retroactive tampering. Resolutions require AI before/after proof comparisons before closing.
                            </p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-blue-700 truncate">
                            SHA: 4f8b9e...d720a1b89
                        </div>
                    </motion.div>
                </div>

                {/* Dual Portal Interactive Switcher */}
                <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                                Tailored Workspaces for Every Stakeholder
                            </h3>
                            <p className="text-slate-600 text-sm mt-1">
                                Seamless synchronization between citizen mobile devices and government dispatch hubs.
                            </p>
                        </div>

                        {/* Switcher Pills */}
                        <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                            <button
                                onClick={() => setPortalTab('citizen')}
                                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                    portalTab === 'citizen'
                                        ? 'bg-[#0F172A] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-[#0F172A]'
                                }`}
                            >
                                Citizen Portal
                            </button>
                            <button
                                onClick={() => setPortalTab('government')}
                                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                    portalTab === 'government'
                                        ? 'bg-orange-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:text-[#0F172A]'
                                }`}
                            >
                                Government Hub
                            </button>
                        </div>
                    </div>

                    {/* Content Panels */}
                    <AnimatePresence mode="wait">
                        {portalTab === 'citizen' ? (
                            <motion.div
                                key="citizen"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                                    <div className="font-bold text-base text-orange-600 mb-2">1. Photo &amp; GPS Tagging</div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Upload damage photos directly. The platform captures pinpoint coordinates and auto-fills ward boundaries.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                                    <div className="font-bold text-base text-orange-600 mb-2">2. Live Status Tracking</div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Watch your issue progress from Pending &rarr; In Progress &rarr; AI-Verified Resolution with real-time socket events.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                                    <div className="font-bold text-base text-orange-600 mb-2">3. Community Upvoting</div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Support neighboring reports on the public feed to elevate critical neighborhood hazards in priority ranking.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="government"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                                    <div className="font-bold text-base text-purple-600 mb-2">1. Command &amp; Analytics</div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Filter city issues by department, severity score, ward, and status with interactive geospatial heatmaps.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                                    <div className="font-bold text-base text-purple-600 mb-2">2. AI Work Plan Generation</div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Mistral AI creates instant 4-step repair strategies for maintenance squads based on the uploaded visual damage.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                                    <div className="font-bold text-base text-purple-600 mb-2">3. Fiscal &amp; Budget Controls</div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Allocate ward budgets, simulate civic repair scenarios, and verify work completion with automated comparison models.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
