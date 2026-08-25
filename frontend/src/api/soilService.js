import api from './api';

export const soilService = {
  analyze: async (data) => {
    const response = await api.post('/soil/analyze', data);
    return response.data;
  },
};
