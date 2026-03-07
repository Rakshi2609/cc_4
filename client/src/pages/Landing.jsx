import React, { lazy } from 'react';
import SuspenseLoader from '../components/SuspenseLoader';

// Lazy load feature entry
const LandingFeature = lazy(() => import('../features/landing/index'));

export default function Landing() {
    return (
        <SuspenseLoader>
            <LandingFeature />
        </SuspenseLoader>
    );
}