package com.certifypro.dto.response;

import com.certifypro.entity.CertificateStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateResponse {
    private UUID id;
    private String name;
    private String description;
    private LocalDate issuedDate;
    private LocalDate expiryDate;
    private CertificateStatus status;
    private String blockchainHash;
    private String qrCode;
    private Integer views;
    private String holderName;
    private String holderUsername;
    private String issuerName;
    private String issuerOrganization;
    private Set<String> skills;
}
