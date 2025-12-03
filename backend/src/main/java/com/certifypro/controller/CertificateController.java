package com.certifypro.controller;

import com.certifypro.dto.request.CertificateRequest;
import com.certifypro.dto.response.ApiResponse;
import com.certifypro.dto.response.CertificateResponse;
import com.certifypro.service.CertificateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping("/issue")
    @PreAuthorize("hasRole('ISSUER')")
    public ResponseEntity<ApiResponse<CertificateResponse>> issueCertificate(
            @Valid @RequestBody CertificateRequest request,
            Authentication authentication) {
        String issuerUsername = authentication.getName();
        CertificateResponse response = certificateService.issueCertificate(request, issuerUsername);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Certificate issued successfully", response));
    }

    @GetMapping("/my-certificates")
    @PreAuthorize("hasRole('INDIVIDUAL')")
    public ResponseEntity<ApiResponse<List<CertificateResponse>>> getMyCertificates(Authentication authentication) {
        String username = authentication.getName();
        List<CertificateResponse> certificates = certificateService.getUserCertificates(username);
        return ResponseEntity.ok(ApiResponse.success("Certificates retrieved successfully", certificates));
    }

    @GetMapping("/issued")
    @PreAuthorize("hasRole('ISSUER')")
    public ResponseEntity<ApiResponse<List<CertificateResponse>>> getIssuedCertificates(Authentication authentication) {
        String issuerUsername = authentication.getName();
        List<CertificateResponse> certificates = certificateService.getIssuedCertificates(issuerUsername);
        return ResponseEntity.ok(ApiResponse.success("Issued certificates retrieved successfully", certificates));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CertificateResponse>> getCertificateById(@PathVariable UUID id) {
        CertificateResponse certificate = certificateService.getCertificateById(id);
        return ResponseEntity.ok(ApiResponse.success("Certificate retrieved successfully", certificate));
    }

    @DeleteMapping("/{id}/revoke")
    @PreAuthorize("hasRole('ISSUER')")
    public ResponseEntity<ApiResponse<Void>> revokeCertificate(
            @PathVariable UUID id,
            Authentication authentication) {
        String issuerUsername = authentication.getName();
        certificateService.revokeCertificate(id, issuerUsername);
        return ResponseEntity.ok(ApiResponse.success("Certificate revoked successfully", null));
    }
}
