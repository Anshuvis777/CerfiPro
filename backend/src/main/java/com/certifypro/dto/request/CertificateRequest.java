package com.certifypro.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class CertificateRequest {

    @NotBlank(message = "Certificate name is required")
    private String name;

    private String description;

    @NotBlank(message = "Recipient email is required")
    @Email(message = "Recipient email should be valid")
    private String recipientEmail;

    @NotNull(message = "Issue date is required")
    private LocalDate issuedDate;

    private LocalDate expiryDate;

    @NotNull(message = "At least one skill is required")
    private Set<String> skills;
}
