import api from './api';

export const priceService = {
  predictPrice: async (district, crop) => {
    const response = await api.get('/price/predict', {
      params: { district, crop }
    });
    return response.data;
  }
};
