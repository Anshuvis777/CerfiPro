package com.certifypro.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class CreateCertificateRequestDto {

    @NotBlank(message = "Issuer username is required")
    private String issuerUsername;

    @NotBlank(message = "Request message is required")
    private String requestMessage;

    @NotNull(message = "At least one skill is required")
    @NotEmpty(message = "At least one skill is required")
    private Set<String> skills;
}
