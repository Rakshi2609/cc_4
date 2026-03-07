import axios from '../../../api/axios';

export const profileApi = {
    getProfile: async () => {
        const response = await axios.get('/api/auth/profile');
        return response.data;
    },
    getUserIssues: async () => {
        const response = await axios.get('/api/issues/my-issues');
        return response.data;
    },
};
