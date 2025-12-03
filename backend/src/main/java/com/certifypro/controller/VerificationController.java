package com.certifypro.controller;

import com.certifypro.dto.response.ApiResponse;
import com.certifypro.dto.response.CertificateResponse;
import com.certifypro.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
public class VerificationController {

    private final CertificateService certificateService;

    @PostMapping
    public ResponseEntity<ApiResponse<CertificateResponse>> verifyCertificate(
            @RequestParam String certificateId) {
        CertificateResponse certificate = certificateService.verifyCertificate(certificateId);
        return ResponseEntity.ok(ApiResponse.success("Certificate verified successfully", certificate));
    }

    @GetMapping("/{certificateId}")
    public ResponseEntity<ApiResponse<CertificateResponse>> verifyCertificateById(
            @PathVariable String certificateId) {
        CertificateResponse certificate = certificateService.verifyCertificate(certificateId);
        return ResponseEntity.ok(ApiResponse.success("Certificate verified successfully", certificate));
    }
}
