import api from './api';

export const fertilizerService = {
  recommend: async (data) => {
    const response = await api.post('/fertilizer/recommend', data);
    return response.data;
  },
};
