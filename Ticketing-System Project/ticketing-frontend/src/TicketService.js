import axios from 'axios';

const API_URL = "https://smart-ticketing-system-v2.onrender.com/api/tickets/book";

const TicketService = {
    book: async (seat) => {
        try {
            // This hits your @PostMapping in Spring Boot
            const response = await axios.post(API_URL, null, {
                params: { eventId: 1, userId: 101, seatNumber: seat }
            });
            return response.data; // Returns "Success..." or "Error..."
        } catch (error) {
            // Returns the professional error message you wrote in Java
            throw error.response?.data || "Connection failed";
        }
    }
};

export default TicketService;
