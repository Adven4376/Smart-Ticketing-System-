package com.Aditya.Ticketing.System.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Aditya.Ticketing.System.entity.Ticket;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    //This method will find a specific seat for an event
    Optional<Ticket> findByEventIdAndSeatNumber(Long eventId, Integer seatNumber);
}
