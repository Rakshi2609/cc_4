import React from 'react';
import { Box, Typography, Container, Grid, Paper, Stack } from '@mui/material';
import { Camera, MapPin, BarChart3, Bell, Shield, Users, Clock, Globe } from 'lucide-react';

const benefitCards = [
    {
        icon: Camera,
        title: 'PHOTO REPORTS',
        description: 'Capture instant evidence with GPS auto-location. Verified by Vision AI.',
        color: '#ef4444'
    },
    {
        icon: MapPin,
        title: 'GEO-CLUSTERING',
        description: 'Automatic detection of duplicate reports via smart spatial clustering.',
        color: '#10b981'
    },
    {
        icon: BarChart3,
        title: 'PRIORITY SCORING',
        description: 'AI analyzes frequency and severity to suggest urgent interventions.',
        color: '#8b5cf6'
    },
    {
        icon: Bell,
        title: 'LIVE ALERTS',
        description: 'Stay updated via real-time WebSocket notifications from your ward.',
        color: '#f59e0b'
    },
    {
        icon: Shield,
        title: 'TRANSPARENCY',
        description: 'Full resolution history with before/after photo evidence.',
        color: '#0ea5e9'
    },
    {
        icon: Users,
        title: 'GOVERNMENT HUB',
        description: 'Dedicated command center for workforce and fiscal management.',
        color: '#475569'
    }
];

export const BenefitsSection = () => {
    return (
        <Box component="section" sx={{ py: 20, backgroundColor: '#f8fafc' }}>
            <Container maxWidth="xl">
                <Box sx={{ maxWidth: 800, mb: 12, mx: 'auto', textAlign: 'center' }}>
                    <Typography
                        variant="overline"
                        sx={{
                            fontWeight: 900,
                            color: 'primary.main',
                            letterSpacing: '0.2em',
                            display: 'block',
                            mb: 2
                        }}
                    >
                        PLATFORM CAPABILITIES
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            color: '#0f172a',
                            letterSpacing: '-0.02em',
                            mb: 3
                        }}
                    >
                        BUILT FOR SCALE. BUILT FOR PEOPLE.
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400 }}>
                        We've engineered a sophisticated stack to solve real-world urban infrastructure challenges.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {benefitCards.map((benefit, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 5,
                                    height: '100%',
                                    borderRadius: 5,
                                    border: '1px solid #e2e8f0',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.05)',
                                        borderColor: '#cbd5e1'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        backgroundColor: `${benefit.color}15`,
                                        borderRadius: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 4
                                    }}
                                >
                                    <benefit.icon size={28} color={benefit.color} />
                                </Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 900,
                                        color: '#0f172a',
                                        mb: 2,
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    {benefit.title}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.7 }}>
                                    {benefit.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default BenefitsSection;
