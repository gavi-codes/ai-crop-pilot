import api from './api';

export const weatherService = {
  getWeather: async (district) => {
    const response = await api.get(`/weather/${encodeURIComponent(district)}`);
    return response.data;
  },
};
