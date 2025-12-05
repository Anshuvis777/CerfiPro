package com.certifypro.dto.response;

import com.certifypro.entity.CertificateRequest.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateRequestResponse {

    private UUID id;
    private String requesterUsername;
    private String requesterEmail;
    private String issuerUsername;
    private String requestMessage;
    private Set<String> skills;
    private RequestStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime respondedAt;
    private String rejectionReason;

    // Payment fields
    private Double paymentAmount;
    private Boolean isPaid;
    private String paymentTransactionId;
    private LocalDateTime paidAt;
}
