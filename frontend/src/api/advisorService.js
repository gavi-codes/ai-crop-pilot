import api from './api';

export const advisorService = {
  getRecommendation: async () => {
    const response = await api.get('/advisor/recommend');
    return response.data;
  },
};
