package com.certifypro.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "certificate_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issuer_id", nullable = false)
    private User issuer;

    @Column(columnDefinition = "TEXT")
    private String requestMessage;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "certificate_request_skills", joinColumns = @JoinColumn(name = "certificate_request_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
    @Builder.Default
    private Set<Skill> skills = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime respondedAt;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    // Payment fields
    @Column(nullable = false)
    @Builder.Default
    private Double paymentAmount = 10.0; // Fixed ₹10 fee

    @Column(nullable = false)
    @Builder.Default
    private Boolean isPaid = false;

    private String paymentTransactionId; // Optional: for tracking payment reference

    private LocalDateTime paidAt;

    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}
