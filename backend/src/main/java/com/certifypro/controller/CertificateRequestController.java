package com.certifypro.controller;

import com.certifypro.dto.request.ApproveCertificateRequestDto;
import com.certifypro.dto.request.CreateCertificateRequestDto;
import com.certifypro.dto.request.RejectCertificateRequestDto;
import com.certifypro.dto.response.ApiResponse;
import com.certifypro.dto.response.CertificateRequestResponse;
import com.certifypro.service.CertificateRequestService;
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
@RequestMapping("/api/certificate-requests")
@RequiredArgsConstructor
public class CertificateRequestController {

    private final CertificateRequestService certificateRequestService;

    @PostMapping
    @PreAuthorize("hasRole('INDIVIDUAL')")
    public ResponseEntity<ApiResponse<CertificateRequestResponse>> createRequest(
            @Valid @RequestBody CreateCertificateRequestDto dto,
            Authentication authentication) {
        String requesterUsername = authentication.getName();
        CertificateRequestResponse response = certificateRequestService.createRequest(requesterUsername, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Certificate request created successfully", response));
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('INDIVIDUAL')")
    public ResponseEntity<ApiResponse<List<CertificateRequestResponse>>> getMyRequests(Authentication authentication) {
        String username = authentication.getName();
        List<CertificateRequestResponse> requests = certificateRequestService.getMyRequests(username);
        return ResponseEntity.ok(ApiResponse.success("Requests retrieved successfully", requests));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ISSUER')")
    public ResponseEntity<ApiResponse<List<CertificateRequestResponse>>> getPendingRequests(
            Authentication authentication) {
        String issuerUsername = authentication.getName();
        List<CertificateRequestResponse> requests = certificateRequestService.getPendingRequests(issuerUsername);
        return ResponseEntity.ok(ApiResponse.success("Pending requests retrieved successfully", requests));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ISSUER')")
    public ResponseEntity<ApiResponse<List<CertificateRequestResponse>>> getAllRequests(Authentication authentication) {
        String issuerUsername = authentication.getName();
        List<CertificateRequestResponse> requests = certificateRequestService.getAllRequestsForIssuer(issuerUsername);
        return ResponseEntity.ok(ApiResponse.success("All requests retrieved successfully", requests));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ISSUER')")
    public ResponseEntity<ApiResponse<CertificateRequestResponse>> approveRequest(
            @PathVariable UUID id,
            @Valid @RequestBody ApproveCertificateRequestDto dto,
            Authentication authentication) {
        String issuerUsername = authentication.getName();
        CertificateRequestResponse response = certificateRequestService.approveRequest(id, dto, issuerUsername);
        return ResponseEntity.ok(ApiResponse.success("Certificate request approved successfully", response));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ISSUER')")
    public ResponseEntity<ApiResponse<CertificateRequestResponse>> rejectRequest(
            @PathVariable UUID id,
            @Valid @RequestBody RejectCertificateRequestDto dto,
            Authentication authentication) {
        String issuerUsername = authentication.getName();
        CertificateRequestResponse response = certificateRequestService.rejectRequest(id, dto, issuerUsername);
        return ResponseEntity.ok(ApiResponse.success("Certificate request rejected successfully", response));
    }
}
