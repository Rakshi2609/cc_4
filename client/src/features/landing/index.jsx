import React from 'react';
import LandingHero from './components/LandingHero';
import PublicStats from './components/PublicStats';
import BenefitsSection from './components/BenefitsSection';
import SuspenseLoader from '../../components/SuspenseLoader';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const LandingFeature = () => (
    <div style={{ width: '100%' }}>
        <LandingHero />

        <SuspenseLoader>
            <PublicStats />
        </SuspenseLoader>

        <BenefitsSection />

        {/* ─── FINAL CTA ─────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '6rem 1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(99,102,241,0.8)', textTransform: 'uppercase', marginBottom: '1rem' }}>GET STARTED TODAY</p>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.03em', marginBottom: '1rem', lineHeight: 1.1 }}>
                Your city needs you.<br />
                <span style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Start reporting.</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
                Join thousands of citizens already making their wards safer, cleaner, and smarter.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                    to="/register"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                        color: '#fff', padding: '14px 36px', borderRadius: '12px',
                        fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
                    }}
                >
                    Create Free Account <ArrowRight size={18} />
                </Link>
                <Link
                    to="/city-feed"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                        color: '#e2e8f0', padding: '14px 36px', borderRadius: '12px',
                        fontWeight: 600, fontSize: '1rem', textDecoration: 'none',
                    }}
                >
                    Browse City Feed
                </Link>
            </div>
        </section>
    </div>
);

export default LandingFeature;
