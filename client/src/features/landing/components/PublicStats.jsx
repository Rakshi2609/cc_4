import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { landingApi } from '../api/landingApi';

const STAT_META = [
    { key: 'resolvedCount', label: 'Issues Resolved', suffix: '+', color: '#10b981' },
    { key: 'activeCitizens', label: 'Active Citizens', suffix: '+', color: '#3b82f6' },
    { key: 'averageResponseTime', label: 'Avg Response Time', suffix: '', color: '#f59e0b' },
    { key: 'hotspotsIdentified', label: 'Hotspots Identified', suffix: '+', color: '#8b5cf6' },
];

export const PublicStats = () => {
    const { data: stats } = useSuspenseQuery({
        queryKey: ['public-stats'],
        queryFn: landingApi.getPublicStats,
        staleTime: 60_000,
    });

    return (
        <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '3rem 1.5rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px,1fr))', gap: '1rem' }}>
                {STAT_META.map(({ key, label, suffix, color }) => (
                    <div key={key} style={{ textAlign: 'center', padding: '1.25rem', borderRadius: '14px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '2.25rem', fontWeight: 900, fontFamily: 'monospace', color, marginBottom: '0.25rem', letterSpacing: '-0.03em' }}>
                            {stats[key] ?? '—'}{stats[key] != null ? suffix : ''}
                        </div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: '#94a3b8', textTransform: 'uppercase' }}>{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PublicStats;
