import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smart-ticketing-system-v2.onrender.com/api',
  timeout: 5000,
});

export const bookTicket = async (eventId, userId, seatNumber) => {
  try {
    const response = await api.post('/tickets/book', null, {
      params: { eventId, userId, seatNumber }
    });
    return response.data;
  } catch (error) {
    // This will catch the "High traffic" error from your Java code
    throw error.response?.data || "Server connection failed";
  }
};
