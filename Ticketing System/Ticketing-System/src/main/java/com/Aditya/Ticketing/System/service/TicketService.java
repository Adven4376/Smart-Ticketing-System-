package com.Aditya.Ticketing.System.service;

import com.Aditya.Ticketing.System.entity.Ticket;
import com.Aditya.Ticketing.System.repository.TicketRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    /**
     * Final 2026-Ready Booking Logic
     * Handles:
     * 1. Manual Check (Business Logic)
     * 2. Optimistic Locking (Concurrency)
     * 3. Database Constraints (Integrity)
     */
    @Transactional
    public String bookTicket(Long eventId, Long userId, String userName, Integer seatNumber) {
        try {
            // 1. First Check: See if the seat is already in the database
            Optional<Ticket> existingTicket = ticketRepository.findByEventIdAndSeatNumber(eventId, seatNumber);
            if (existingTicket.isPresent()) {
                return "Error: Seat " + seatNumber + " is already booked for this event!";
            }

            // 2. Prepare the new booking
            Ticket newTicket = new Ticket();
            newTicket.setEventId(eventId);
            newTicket.setUserId(userId);
            newTicket.setUserName(userName); //  ✅ new username
            newTicket.setSeatNumber(seatNumber);
            newTicket.setStatus("BOOKED");
            newTicket.setCreatedAt(java.time.LocalDateTime.now()); // ✅ AUTO TIMESTAMP

            // 3. Save and Flush immediately to trigger any Database/JPA conflicts NOW
            ticketRepository.saveAndFlush(newTicket);

            return "Success! Ticket for Seat " + seatNumber + " booked for User " + userId;

        } catch (DataIntegrityViolationException e) {
            // This catches the 'Unique Constraint' violation if two people save at once
            return "Error: Someone just beat you to seat " + seatNumber + "! Please try another.";

        } catch (ObjectOptimisticLockingFailureException e) {
            // This catches the @Version conflict for high-traffic updates
            return "Error: High traffic conflict. Your request was safely rejected. Please try again.";

        } catch (Exception e) {
            // Fallback for any other unexpected issues
            return "Error: An unexpected error occurred: " + e.getMessage();
        }
    }

    public String bookMultipleTickets(Long eventId, Long userId, String userName, List<Integer> seatNumbers) {
        StringBuilder results = new StringBuilder();
        for (Integer seat : seatNumbers) {
            try {
                // Re-use your existing individual booking logic for each seat
                String res = bookTicket(eventId, userId, userName, seat);
                results.append(seat).append(": ").append(res).append("\n");
            } catch (Exception e) {
                results.append(seat).append(": Failed (").append(e.getMessage()).append(")\n");
            }
        }
        return results.toString();
    }

    public String cancelTicket(Long eventId, Integer seatNumber, Long userId) {
        Optional<Ticket> ticketOpt = ticketRepository.findByEventIdAndSeatNumber(eventId, seatNumber);

        if (ticketOpt.isEmpty()) {
            return "Error: Ticket not found.";
        }

        Ticket ticket = ticketOpt.get();

        // 🔒 SECURITY CHECK: Only owner can cancel
        if (!ticket.getUserId().equals(userId)) {
            return "Error: You are not allowed to cancel someone else's ticket!";
        }

        ticketRepository.delete(ticket);
        return "Success: Seat " + seatNumber + " has been cancelled by User " + userId + ".";
    }


}






