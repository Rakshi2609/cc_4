import axios from '../../../api/axios.js';

export const landingApi = {
    getPublicStats: async () => {
        const { data } = await axios.get('/issues/public-stats');
        return data;
    }
};
