package com.Aditya.Ticketing.System.controller;

import com.Aditya.Ticketing.System.entity.Ticket;
import com.Aditya.Ticketing.System.repository.TicketRepository;
import com.Aditya.Ticketing.System.service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RestController
@RequestMapping("/api/tickets") // The base URL for all ticket actions
public class TicketController {

    private final TicketRepository ticketRepository;

    private final TicketService ticketService;

    //Constructor Injection
    public TicketController (TicketRepository ticketRepository, TicketService ticketService){
        this.ticketRepository = ticketRepository;
        this.ticketService = ticketService;
    }

    @GetMapping("/event/{eventId}")
    public List<Integer> getBookedSeatsByEvent(@PathVariable Long eventId) {
        return ticketRepository.findAll()
                .stream()
                .filter(t -> t.getEventId().equals(eventId))
                .map(Ticket::getSeatNumber)
                .toList();
    }

    @GetMapping("/all")
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // http://localhost:7777/api/tickets/book?eventId=1&userId=101&seatNumber=45
    @PostMapping("/book")
    public String bookTicket(
            @RequestParam Long eventId,
            @RequestParam Long userId,
            @RequestParam Integer seatNumber) {

        return ticketService.bookTicket(eventId, userId, seatNumber);
    }

    // http://localhost:7777/status
    @GetMapping("/status")
    public String getStatus() {
        return "Ticketing System is UP and running on Java 25!";
    }

    @PostMapping("/book-multiple")
    public String bookMultiple(
            @RequestParam Long eventId,
            @RequestParam Long userId,
            @RequestParam List<Integer> seatNumbers) {
        return ticketService.bookMultipleTickets(eventId, userId, seatNumbers);
    }

    @DeleteMapping("/cancel")
    public String cancelTicket(@RequestParam Long eventId, @RequestParam Integer seatNumber) {
        return ticketService.cancelTicket(eventId, seatNumber);
    }
}
