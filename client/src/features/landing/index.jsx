import React from 'react';
import { Box } from '@mui/material';
import LandingHero from './components/LandingHero';
import PublicStats from './components/PublicStats';
import BenefitsSection from './components/BenefitsSection';
import SuspenseLoader from '../../components/SuspenseLoader';

export const LandingFeature = () => {
    return (
        <Box sx={{ width: '100%' }}>
            {/* Hero stays at top, non-suspense unless it has data */}
            <LandingHero />

            {/* PublicStats has data, so it gets a loader internally or externally */}
            <SuspenseLoader>
                <PublicStats />
            </SuspenseLoader>

            {/* Benefits are static but we follow the pattern */}
            <BenefitsSection />

            {/* Additional simple static footer/CTA */}
            <Box
                sx={{
                    py: 20,
                    textAlign: 'center',
                    backgroundColor: '#0f172a',
                    color: '#ffffff'
                }}
            >
                <Box sx={{ maxWidth: 800, mx: 'auto', px: 4 }}>
                    <Box
                        sx={{
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            letterSpacing: '0.5em',
                            color: 'rgba(255,255,255,0.4)',
                            mb: 6
                        }}
                    >
                        TRANSFORM_THE_CITY_NOW
                    </Box>
                    <Box sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 900, mb: 6, lineHeight: 1 }}>
                        Ready to contribute?
                    </Box>
                    <Box
                        sx={{
                            p: 2.5,
                            mt: 4,
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'inline-block',
                            borderRadius: 4,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'white', color: 'black' },
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            fontSize: '1rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em'
                        }}
                        onClick={() => window.location.href = '/register'}
                    >
                        LAUNCH_PORTAL_V1
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default LandingFeature;
