import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, MapPin, Zap, Shield, Bell } from 'lucide-react';

const FEATURES = [
    { label: 'Photo + GPS Report', icon: Camera },
    { label: 'AI Vision Verify', icon: Zap },
    { label: 'Geo-Cluster Hotspots', icon: MapPin },
    { label: 'Real-Time Alerts', icon: Bell },
    { label: 'Resolution Audit Trail', icon: Shield },
];

const STEPS = [
    { num: '01', title: 'Snap & Submit', desc: 'Photograph the issue. GPS auto-tags the location. AI verifies category in seconds.' },
    { num: '02', title: 'Smart Clustering', desc: 'Duplicate reports within 100 m merge into a priority hotspot automatically.' },
    { num: '03', title: 'Gov Dispatch', desc: 'Government assigns a crew. AI generates a 4-step maintenance strategy on-the-fly.' },
    { num: '04', title: 'Verified Resolved', desc: 'Before/after AI photo comparison confirms the fix. Status history locked with SHA-256.' },
];

export const LandingHero = () => {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick(t => (t + 1) % FEATURES.length), 2200);
        return () => clearInterval(id);
    }, []);

    const ActiveIcon = FEATURES[tick].icon;

    return (
        <>
            {/* ─── HERO ───────────────────────────────────────────────────── */}
            <section
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '7rem 1.5rem 5rem',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >


                {/* Badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '999px', padding: '6px 16px', marginBottom: '2rem' }}>
                    <Zap size={13} color="#60a5fa" />
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: '#60a5fa', textTransform: 'uppercase' }}>AI-Powered Civic Intelligence</span>
                </div>

                {/* Headline */}
                <h1 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 5rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.04em', color: '#f8fafc', textAlign: 'center', maxWidth: '1100px', marginBottom: '1.5rem', whiteSpace: 'nowrap' }}>
                    Fix Your City —{' '}
                    <span style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Before Tomorrow
                    </span>
                </h1>

                <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#94a3b8', maxWidth: '620px', textAlign: 'center', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                    Report potholes, broken streetlights, and drainage issues in 30 seconds.
                    Qwen 120B Vision AI verifies every photo. Government responds faster.
                </p>

                {/* Animated feature ticker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 20px', marginBottom: '2.5rem', minWidth: '260px', justifyContent: 'center' }}>
                    <ActiveIcon size={16} color="#a78bfa" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', letterSpacing: '0.03em' }}>{FEATURES[tick].label}</span>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3.5rem' }}>
                    <Link
                        to="/register"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                            color: '#fff', padding: '14px 32px', borderRadius: '12px',
                            fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
                        }}
                    >
                        Report an Issue <ArrowRight size={18} />
                    </Link>
                    <Link
                        to="/login"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                            color: '#e2e8f0', padding: '14px 32px', borderRadius: '12px',
                            fontWeight: 600, fontSize: '1rem', textDecoration: 'none',
                        }}
                    >
                        Government Login
                    </Link>
                </div>

                {/* Trust strip */}
                <div style={{ display: 'flex', gap: 'clamp(16px,4vw,48px)', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['JWT Auth', 'Socket.IO Live', 'Featherless AI', 'MongoDB Atlas', 'Cloudinary CDN'].map(t => (
                        <span key={t} style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(148,163,184,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t}</span>
                    ))}
                </div>
            </section>

            {/* ─── HOW IT WORKS ──────────────────────────────────────────── */}
            <section style={{ background: '#f8fafc', padding: '5rem 1.5rem' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', color: '#3b82f6', textTransform: 'uppercase', marginBottom: '0.75rem' }}>HOW IT WORKS</p>
                    <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '3.5rem' }}>From Report to Resolved — 4 Steps</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem' }}>
                        {STEPS.map((s, i) => (
                            <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: '-10px', right: '-4px', fontSize: '5rem', fontWeight: 900, color: '#f1f5f9', lineHeight: 1, userSelect: 'none' }}>{s.num}</div>
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <span style={{ display: 'inline-block', background: '#0f172a', color: '#fff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', padding: '3px 10px', borderRadius: '999px', marginBottom: '1rem', textTransform: 'uppercase' }}>{s.num}</span>
                                    <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.title}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default LandingHero;
