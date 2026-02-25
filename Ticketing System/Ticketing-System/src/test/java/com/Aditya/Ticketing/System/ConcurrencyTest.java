package com.Aditya.Ticketing.System;

import com.Aditya.Ticketing.System.service.TicketService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class ConcurrencyTest {

    @Autowired
    private TicketService ticketService;

    @Test
    void testConcurrentBooking() {
        // We trigger two bookings for the SAME seat simultaneously
        CompletableFuture<String> user1 = CompletableFuture.supplyAsync(() ->
                ticketService.bookTicket(1L, 101L, "User101", 50));


        CompletableFuture<String> user2 = CompletableFuture.supplyAsync(() ->
                ticketService.bookTicket(1L, 102L, "User102", 50));

        // Wait for both to finish
        String res1 = user1.join();
        String res2 = user2.join();

        System.out.println("User 1 Result: " + res1);
        System.out.println("User 2 Result: " + res2);

        // PROOF: One must succeed, and one must fail!
        // This checks that exactly ONE success occurred
        boolean oneSuccess = res1.contains("Success") ^ res2.contains("Success");

        assertTrue(oneSuccess, "Only ONE user should have successfully booked the seat!");
    }

}
