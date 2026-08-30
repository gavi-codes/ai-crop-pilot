import api from './api';

export const maturityService = {
  analyze: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/maturity/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
