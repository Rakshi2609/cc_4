import React, { useCallback } from 'react';
import { Box, Typography, Button, Container, Stack, Paper } from '@mui/material';
import { ArrowRight, Play, Zap, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureBadge = ({ icon: Icon, text, color = '#3b82f6' }) => (
    <Paper
        elevation={0}
        sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1,
            borderRadius: 50,
            border: `1px solid ${color}20`,
            backgroundColor: `${color}10`,
            mb: 4
        }}
    >
        <Icon size={14} color={color} />
        <Typography
            variant="caption"
            sx={{
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: color
            }}
        >
            {text}
        </Typography>
    </Paper>
);

export const LandingHero = () => {
    return (
        <Box
            component="section"
            sx={{
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                pt: { xs: 15, md: 5 },
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
            }}
        >
            {/* Background Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 600,
                    height: 600,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -200,
                    left: -100,
                    width: 800,
                    height: 800,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(234,179,8,0.05) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: 0
                }}
            />

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
                    <FeatureBadge icon={Zap} text="AI-POWERED CIVIC INTELLIGENCE" />

                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '3rem', md: '5.5rem' },
                            fontWeight: 900,
                            lineHeight: 1.1,
                            letterSpacing: '-0.04em',
                            mb: 4,
                            color: '#0f172a'
                        }}
                    >
                        TRANSFORMING CITIES WITH{' '}
                        <Box component="span" sx={{
                            background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>
                            SMART TECH
                        </Box>
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            color: '#64748b',
                            lineHeight: 1.6,
                            mb: 6,
                            maxWidth: 700,
                            mx: 'auto',
                            fontWeight: 400
                        }}
                    >
                        Report infrastructure problems in 30 seconds. Powered by Gemini Vision AI and real-time geo-clustering for rapid government response.
                    </Typography>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={3}
                        justifyContent="center"
                    >
                        <Button
                            variant="contained"
                            size="large"
                            component={Link}
                            to="/register"
                            endIcon={<ArrowRight size={20} />}
                            sx={{
                                py: 2,
                                px: 5,
                                borderRadius: 3,
                                fontSize: '1rem',
                                fontWeight: 800,
                                textTransform: 'none',
                                backgroundColor: '#1e293b',
                                '&:hover': { backgroundColor: '#0f172a', transform: 'translateY(-2px)' },
                                transition: 'all 0.2s',
                                boxShadow: '0 20px 40px -10px rgba(15,23,42,0.3)'
                            }}
                        >
                            Report First Issue
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            component={Link}
                            to="/login"
                            startIcon={<Play size={20} />}
                            sx={{
                                py: 2,
                                px: 5,
                                borderRadius: 3,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderColor: '#e2e8f0',
                                color: '#475569',
                                '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' },
                                transition: 'all 0.2s'
                            }}
                        >
                            Watch How It Works
                        </Button>
                    </Stack>

                    <Box sx={{ mt: 10, display: 'flex', gap: { xs: 3, md: 6 }, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[
                            { icon: Shield, text: 'SECURE AUTH' },
                            { icon: Globe, text: 'LIVE SYNC' },
                            { icon: Zap, text: 'GEMINI AI' }
                        ].map((item, idx) => (
                            <Stack key={idx} direction="row" spacing={1} alignItems="center">
                                <item.icon size={16} color="#94a3b8" />
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, letterSpacing: '0.1em' }}>
                                    {item.text}
                                </Typography>
                            </Stack>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default LandingHero;
