import {
    Car, Droplets, Zap, Construction, Wind, CloudRain, MoreHorizontal, Clock,
} from 'lucide-react';

const CAT_ICON = {
    traffic: Car, water: Droplets, power: Zap, drainage: CloudRain,
    construction: Construction, pollution: Wind, other: MoreHorizontal,
};

const CAT_STYLE = {
    traffic: { bg: 'bg-white', border: 'border-orange-200', icon: 'text-orange-600', label: 'bg-orange-50 text-orange-700' },
    water: { bg: 'bg-white', border: 'border-cyan-200', icon: 'text-cyan-600', label: 'bg-cyan-50 text-cyan-700' },
    power: { bg: 'bg-white', border: 'border-amber-200', icon: 'text-amber-600', label: 'bg-amber-50 text-amber-700' },
    drainage: { bg: 'bg-white', border: 'border-blue-200', icon: 'text-blue-600', label: 'bg-blue-50 text-blue-700' },
    construction: { bg: 'bg-white', border: 'border-slate-300', icon: 'text-slate-600', label: 'bg-slate-100 text-slate-700' },
    pollution: { bg: 'bg-white', border: 'border-purple-200', icon: 'text-purple-600', label: 'bg-purple-50 text-purple-700' },
    other: { bg: 'bg-white', border: 'border-slate-200', icon: 'text-slate-500', label: 'bg-slate-100 text-slate-600' },
};

const SEV_STYLE = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-rose-50 text-rose-700 border-rose-200',
};

function timeAgo(date) {
    const diff = (Date.now() - new Date(date).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function AlertCard({ alert }) {
    const style = CAT_STYLE[alert.category] || CAT_STYLE.other;
    const CatIcon = CAT_ICON[alert.category] || MoreHorizontal;
    const isCritical = alert.severity === 'critical';

    return (
        <div className={`bg-white border ${style.border} rounded-2xl p-4 sm:p-5 transition-all hover:shadow-md ${isCritical ? 'ring-2 ring-rose-300 ring-offset-1' : ''}`}>
            <div className="flex items-start gap-3.5">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${style.label}`}>
                    <CatIcon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="text-sm font-bold text-[#0F172A] line-clamp-1">{alert.title}</h3>
                        {isCritical && (
                            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse flex-shrink-0" />
                        )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">{alert.description}</p>

                    <div className="flex items-center gap-2 flex-wrap text-xs">
                        {/* Severity badge */}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${SEV_STYLE[alert.severity] || SEV_STYLE.info}`}>
                            {alert.severity}
                        </span>

                        {/* Category label */}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${style.label}`}>
                            {alert.category}
                        </span>

                        {/* Zone */}
                        {alert.zone && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
                                📍 {alert.zone}
                            </span>
                        )}

                        {/* Time ago */}
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 ml-auto">
                            <Clock size={11} /> {timeAgo(alert.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
