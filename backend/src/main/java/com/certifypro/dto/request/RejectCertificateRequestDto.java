package com.certifypro.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectCertificateRequestDto {

    @NotBlank(message = "Rejection reason is required")
    private String rejectionReason;
}
