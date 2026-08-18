import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { ShieldCheck, Flame, MapPin, Activity, Building2, Calendar, ArrowUpRight } from 'lucide-react';

// Returns Cloudinary/remote URLs as-is; prepends backend host for legacy local paths
const imgUrl = (u) => {
  if (!u || u === '') return null;
  if (u.startsWith('http')) return u;
  return `http://localhost:5000${u.startsWith('/') ? '' : '/'}${u}`;
};

const CATEGORY_COLOR = {
  Pothole: 'text-orange-700 bg-orange-50 border-orange-200/80',
  Streetlight: 'text-amber-700 bg-amber-50 border-amber-200/80',
  Garbage: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
  Drainage: 'text-blue-700 bg-blue-50 border-blue-200/80',
  'Water Leakage': 'text-cyan-700 bg-cyan-50 border-cyan-200/80',
  Others: 'text-slate-700 bg-slate-100 border-slate-200',
};

export default function IssueCard({ issue, govView = false }) {
  const date = new Date(issue.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const isClusterPrimary = issue.isCluster;
  const isClusterMember = !!issue.clusterId;
  const memberCount = issue.clusterMembers?.length || 0;
  const catColor = CATEGORY_COLOR[issue.category] || CATEGORY_COLOR.Others;
  const catShort = issue.category?.substring(0, 2).toUpperCase() || 'XX';

  const severity = issue.severityScore ?? 0;
  const sevColor = severity >= 70 ? 'text-rose-600 bg-rose-50 border-rose-200'
    : severity >= 50 ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-emerald-600 bg-emerald-50 border-emerald-200';
  const sevBar = severity >= 70 ? 'bg-rose-500' : severity >= 50 ? 'bg-amber-400' : 'bg-emerald-500';

  return (
    <Link
      to={`/issues/${issue._id}`}
      className="group block bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-orange-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image or Category Banner */}
      <div>
        {(issue.imageUrl || issue.photoUrl) ? (
          <div className="relative h-44 overflow-hidden bg-slate-100">
            <img
              src={imgUrl(issue.imageUrl || issue.photoUrl)}
              alt={issue.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            <div className="absolute bottom-2.5 left-3">
              <StatusBadge status={issue.status} />
            </div>

            {issue.aiVerified && (
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white shadow-sm backdrop-blur-md">
                <ShieldCheck size={11} />
                <span className="font-mono text-[10px] font-bold tracking-wide">AI VERIFIED</span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-between px-5 bg-gradient-to-r from-slate-50 to-orange-50/40 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-xs ${catColor}`}>
                {catShort}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {issue.category}
              </span>
            </div>
            <StatusBadge status={issue.status} />
          </div>
        )}

        <div className="p-4 sm:p-5">
          {/* Cluster Hotspot Indicator */}
          {isClusterPrimary && (
            <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
              <Flame size={11} className="text-amber-500 animate-pulse" />
              <span>GEO-HOTSPOT &bull; {memberCount + 1} REPORTS</span>
            </div>
          )}

          {isClusterMember && !isClusterPrimary && (
            <div className="mb-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold">
              <span>CLUSTER MEMBER</span>
            </div>
          )}

          {/* Title */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
              {issue.title}
            </h3>
            <ArrowUpRight size={15} className="text-slate-400 group-hover:text-orange-600 transition-colors flex-shrink-0 mt-0.5" />
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-3.5 leading-relaxed">
            {issue.description}
          </p>

          {/* Category Pill & Date */}
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catColor}`}>
              {issue.category?.toUpperCase() || 'CIVIC ISSUE'}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <Calendar size={11} />
              {date}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Meta & Severity */}
      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100/90 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 truncate max-w-[65%]">
            <MapPin size={11} className="text-rose-500 flex-shrink-0" />
            {issue.location?.address
              ? issue.location.address.substring(0, 24) + (issue.location.address.length > 24 ? '…' : '')
              : `${Number(issue.location?.coordinates?.[1]).toFixed(3)}°, ${Number(issue.location?.coordinates?.[0]).toFixed(3)}°`}
          </span>

          <span className={`flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${sevColor}`}>
            <Activity size={9} />
            {severity}% Sev
          </span>
        </div>

        {/* Severity Bar */}
        <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${sevBar}`} style={{ width: `${severity}%` }} />
        </div>

        {issue.assignedDepartment && (
          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-mono text-slate-500">
            <Building2 size={10} className="text-orange-500" />
            <span className="truncate">Dept: {issue.assignedDepartment}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
