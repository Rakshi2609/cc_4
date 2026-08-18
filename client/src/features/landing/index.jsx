import React from 'react';
import QuordixHero from '@/components/ui/quordix-hero';
import PublicStats from './components/PublicStats';
import BenefitsSection from './components/BenefitsSection';
import CTASection from './components/CTASection';
import SuspenseLoader from '../../components/SuspenseLoader';

export const LandingFeature = () => (
    <div className="w-full bg-[#F8FAFC] min-h-screen text-slate-900 selection:bg-orange-500 selection:text-white font-sans">
        {/* Integrated Quordix Hero Component */}
        <QuordixHero />

        {/* Real-Time Municipal Telemetry Stream */}
        <SuspenseLoader>
            <PublicStats />
        </SuspenseLoader>

        {/* Interactive Bento Grid, Govt Showcase & Feature Architecture */}
        <BenefitsSection />

        {/* Cohesive Light-Theme CTA Banner */}
        <CTASection />
    </div>
);

export default LandingFeature;
