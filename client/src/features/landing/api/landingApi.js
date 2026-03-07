// Mocking public stats for the landing page
export const landingApi = {
    getPublicStats: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    resolvedCount: 1428,
                    activeCitizens: 5240,
                    activeWorkers: 186,
                    averageResponseTime: '3.2h',
                    hotspotsIdentified: 142
                });
            }, 800); // simulate delay for suspense loader
        });
    }
};
