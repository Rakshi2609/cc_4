import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { landingApi } from '../api/landingApi';

const StatBox = ({ label, value }) => (
    <Box sx={{ textAlign: 'center', p: 2 }}>
        <Typography
            variant="h4"
            sx={{
                fontWeight: 900,
                color: 'primary.main',
                fontFamily: 'monospace',
                mb: 0.5
            }}
        >
            {value}+
        </Typography>
        <Typography
            variant="caption"
            sx={{
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600
            }}
        >
            {label}
        </Typography>
    </Box>
);

export const PublicStats = () => {
    const { data: stats } = useSuspenseQuery({
        queryKey: ['public-stats'],
        queryFn: landingApi.getPublicStats,
    });

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 4,
                py: 12,
                borderY: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
            }}
        >
            <StatBox label="Issues Resolved" value={stats.resolvedCount} />
            <StatBox label="Active Citizens" value={stats.activeCitizens} />
            <StatBox label="Response Time" value={stats.averageResponseTime} />
            <StatBox label="Hotspots Fixed" value={stats.hotspotsIdentified} />
        </Box>
    );
};

export default PublicStats;
