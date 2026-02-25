package com.Aditya.Ticketing.System.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "tickets", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"eventId", "seatNumber"})
})

@Data
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long eventId;
    private Long userId;
    private Integer seatNumber;
    private String status; // "AVAILABLE", "HOLD", "BOOKED"

    @Version
    private Integer version; // THE MAGIC: This is your 2026 Optimistic Lock!

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "user_name")
    private String userName;

}
