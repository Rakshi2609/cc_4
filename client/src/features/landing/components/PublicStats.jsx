import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { landingApi } from '../api/landingApi';
import { CheckCircle, Users, Clock, Flame } from 'lucide-react';

const STAT_META = [
    {
        key: 'resolvedCount',
        label: 'Issues Resolved',
        suffix: '+',
        textColor: 'text-emerald-600',
        bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
        icon: CheckCircle,
        desc: 'Verified by AI before/after comparisons'
    },
    {
        key: 'activeCitizens',
        label: 'Active Citizens',
        suffix: '+',
        textColor: 'text-orange-600',
        bgIcon: 'bg-orange-50 text-orange-600 border-orange-200/60',
        icon: Users,
        desc: 'Engaged across municipal wards'
    },
    {
        key: 'averageResponseTime',
        label: 'Avg Turnaround',
        suffix: '',
        textColor: 'text-blue-600',
        bgIcon: 'bg-blue-50 text-blue-600 border-blue-200/60',
        icon: Clock,
        desc: 'From initial snapshot to crew dispatch'
    },
    {
        key: 'hotspotsIdentified',
        label: 'Hotspots Clustered',
        suffix: '+',
        textColor: 'text-purple-600',
        bgIcon: 'bg-purple-50 text-purple-600 border-purple-200/60',
        icon: Flame,
        desc: '100m proximity auto-merged'
    },
];

export const PublicStats = () => {
    const { data: stats } = useSuspenseQuery({
        queryKey: ['public-stats'],
        queryFn: landingApi.getPublicStats,
        staleTime: 60_000,
    });

    return (
        <section className="relative bg-white border-y border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        <span className="text-xs font-mono uppercase tracking-widest text-slate-700 font-bold">
                            Live Municipal Telemetry Stream
                        </span>
                    </div>

                    <div className="text-xs text-slate-500 font-mono">
                        Auto-synchronized with CivicPlus Database
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {STAT_META.map(({ key, label, suffix, textColor, bgIcon, icon: Icon, desc }, index) => {
                        const rawVal = stats?.[key];
                        const displayVal = rawVal != null && rawVal !== 'N/A' ? `${rawVal}${suffix}` : (rawVal || '0');

                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="group relative rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/80 p-5 hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">
                                        {label}
                                    </span>
                                    <div className={`p-1.5 rounded-lg border ${bgIcon}`}>
                                        <Icon size={16} />
                                    </div>
                                </div>

                                <div className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${textColor} mb-1.5`}>
                                    {displayVal}
                                </div>

                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                    {desc}
                                </p>

                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-0 left-5 right-5 h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-orange-500 transition-all duration-300" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PublicStats;
