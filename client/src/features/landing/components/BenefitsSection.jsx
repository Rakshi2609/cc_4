import React from 'react';
import { Camera, MapPin, BarChart3, Bell, Shield, Users, Briefcase, Activity } from 'lucide-react';

const CARDS = [
    { icon: Camera, color: '#ef4444', bg: '#fef2f2', title: 'Photo Reports', desc: 'Snap a photo — GPS auto-tags the exact ward. Qwen 120B Vision AI verifies the category and authenticity instantly.' },
    { icon: MapPin, color: '#10b981', bg: '#f0fdf4', title: 'Geo-Clustering', desc: 'Reports within 100 m radius auto-merge into a priority hotspot, eliminating duplicates and surfacing real problem zones.' },
    { icon: BarChart3, color: '#8b5cf6', bg: '#faf5ff', title: 'Priority Scoring', desc: 'Each issue is ranked by cluster size, upvote count, age, and AI-assessed severity — so government never misses what matters.' },
    { icon: Bell, color: '#f59e0b', bg: '#fffbeb', title: 'Live Notifications', desc: 'Socket.IO pushes instant status-change alerts to citizens and government the moment an issue moves forward.' },
    { icon: Shield, color: '#0ea5e9', bg: '#f0f9ff', title: 'Transparent Audit Trail', desc: 'Every resolution includes before/after AI photo comparison and an immutable status history with SHA-256 hashes.' },
    { icon: Briefcase, color: '#6366f1', bg: '#eef2ff', title: 'Workforce Hub', desc: 'Assign maintenance crews, generate AI-powered 4-step work plans, and track field execution from a single command center.' },
    { icon: Users, color: '#475569', bg: '#f8fafc', title: 'Dual-Role Dashboards', desc: 'Citizens get a personal reporting hub. Government gets analytics, budget planning, ward management, and live IoT feeds.' },
    { icon: Activity, color: '#ec4899', bg: '#fdf2f8', title: 'City Health Index', desc: 'Kavach AI computes a live CHI score (0–100) from sensor feeds and open issues — a real-time city resilience gauge.' },
];

export const BenefitsSection = () => (
    <>
        {/* ─── FEATURE GRID ─────────────────────────────────── */}
        <section style={{ background: '#fff', padding: '5rem 1.5rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', color: '#8b5cf6', textTransform: 'uppercase', marginBottom: '0.75rem' }}>PLATFORM CAPABILITIES</p>
                <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>Everything Your City Needs</h2>
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.05rem', marginBottom: '3rem', maxWidth: '560px', margin: '0 auto 3rem' }}>A full-stack civic platform engineered for scale, transparency, and real-world impact.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    {CARDS.map((c, i) => (
                        <div
                            key={i}
                            style={{ background: c.bg, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '1.75rem', transition: 'transform 0.25s, box-shadow 0.25s', cursor: 'default' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                        >
                            <div style={{ width: '48px', height: '48px', background: '#fff', border: `1px solid ${c.color}25`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                {React.createElement(c.icon, { size: 22, color: c.color })}
                            </div>
                            <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', marginBottom: '0.4rem' }}>{c.title}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ─── DUAL PORTAL ──────────────────────────────────────── */}
        <section style={{ background: '#0f172a', padding: '5rem 1.5rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {/* Citizen card */}
                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '20px', padding: '2.5rem' }}>
                    <h3 style={{ color: '#60a5fa', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Citizen Portal</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>Report issues with a photo. Track progress live. Upvote hotspots. Get real-time push notifications when your ward's issues are resolved.</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {['Photo + GPS submission', 'Interactive city map', 'Socket.IO live alerts', 'Personal issue history', 'Upvote & prioritize'].map(t => (
                            <li key={t} style={{ color: '#cbd5e1', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>— {t}</li>
                        ))}
                    </ul>
                </div>
                {/* Government card */}
                <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '20px', padding: '2.5rem' }}>
                    <h3 style={{ color: '#a78bfa', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Government Portal</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>Full command center — manage issues, assign crews, plan budgets, and monitor the city's health index from one dashboard.</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {['Analytics & KPI dashboard', 'Workforce assignment + AI plans', 'Fiscal command center', 'Ward & alert management', 'AI resolution verification'].map(t => (
                            <li key={t} style={{ color: '#cbd5e1', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>— {t}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    </>
);

export default BenefitsSection;
