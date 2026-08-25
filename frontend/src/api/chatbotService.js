import api from './api';

export const chatbotService = {
  query: async (message) => {
    const res = await api.post('/chatbot/query', { message });
    return res.data;
  }
};
