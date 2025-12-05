package com.certifypro.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ApproveCertificateRequestDto {

    @NotBlank(message = "Certificate name is required")
    private String certificateName;

    private String description;

    @NotNull(message = "Issue date is required")
    private LocalDate issuedDate;

    private LocalDate expiryDate;
}
