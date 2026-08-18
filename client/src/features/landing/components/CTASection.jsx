import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, MapPin, Activity } from 'lucide-react';

export const CTASection = () => {
    return (
        <section className="relative bg-[#F8FAFC] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-slate-200/80">
            {/* Ambient Background Light Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(234,88,12,0.06),transparent_70%)] pointer-events-none" />
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-200/30 blur-[130px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Clean Light-Theme CTA Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-3xl bg-white border border-orange-200/70 p-8 sm:p-14 text-center shadow-xl shadow-orange-500/5 overflow-hidden"
                >
                    {/* Top Subtle Border Highlight */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80" />

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-widest mb-6">
                        <Sparkles size={13} />
                        <span>Empower Your Neighborhood</span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto">
                        Your Ward Deserves{' '}
                        <span className="text-orange-600">
                            Faster Resolution
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
                        Join civic leaders and active residents transforming city operations with AI-powered reporting and verified accountability.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                        <Link
                            to="/register"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 32px',
                                borderRadius: '9999px',
                                background: '#ea580c',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '1rem',
                                border: 'none',
                                textDecoration: 'none',
                                boxShadow: '0 10px 30px rgba(234,88,12,0.25)',
                                transition: 'all 200ms',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#c2410c'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#ea580c'; e.currentTarget.style.transform = ''; }}
                        >
                            <span>Create Free Citizen Account</span>
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/city-feed"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 28px',
                                borderRadius: '9999px',
                                background: 'rgba(15,23,42,0.05)',
                                color: '#0F172A',
                                fontWeight: 700,
                                fontSize: '1rem',
                                textDecoration: 'none',
                                border: '1px solid rgba(15,23,42,0.12)',
                                transition: 'all 200ms',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.05)'; }}
                        >
                            <MapPin size={17} className="text-orange-600" />
                            <span>Browse Public Issues Map</span>
                        </Link>
                    </div>

                    {/* Bottom Security Footer */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500 pt-6 border-t border-slate-100">
                        <span className="flex items-center gap-1.5">
                            <Shield size={13} className="text-emerald-600" /> End-to-End Cryptographic Audit
                        </span>
                        <span className="text-slate-300 hidden sm:inline">&bull;</span>
                        <span className="flex items-center gap-1.5">
                            <Activity size={13} className="text-orange-600" /> Real-Time Telemetry &amp; Sockets
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
