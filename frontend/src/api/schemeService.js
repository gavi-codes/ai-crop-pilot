import api from './api';

export const schemeService = {
  getEligibleSchemes: async () => {
    const res = await api.get('/schemes/eligible');
    return res.data;
  }
};
