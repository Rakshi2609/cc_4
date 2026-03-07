import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const SuspenseLoader = ({ children }) => {
    return (
        <React.Suspense
            fallback={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '50vh',
                        width: '100%',
                    }}
                >
                    <CircularProgress size={24} sx={{ color: '#64748b' }} />
                    <Box
                        sx={{
                            ml: 2,
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            letterSpacing: '0.2em',
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                        }}
                    >
                        SYS_LOADING...
                    </Box>
                </Box>
            }
        >
            {children}
        </React.Suspense>
    );
};

export default SuspenseLoader;
