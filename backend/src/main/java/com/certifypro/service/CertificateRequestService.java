package com.certifypro.service;

import com.certifypro.dto.request.ApproveCertificateRequestDto;
import com.certifypro.dto.request.CreateCertificateRequestDto;
import com.certifypro.dto.request.RejectCertificateRequestDto;
import com.certifypro.dto.response.CertificateRequestResponse;

import java.util.List;
import java.util.UUID;

public interface CertificateRequestService {

    /**
     * Create a new certificate request
     *
     * @param requesterUsername The username of the requester
     * @param dto               The request details
     * @return The created certificate request
     */
    CertificateRequestResponse createRequest(String requesterUsername, CreateCertificateRequestDto dto);

    /**
     * Get all requests made by a user
     *
     * @param username The username
     * @return List of certificate requests
     */
    List<CertificateRequestResponse> getMyRequests(String username);

    /**
     * Get pending requests for an issuer
     *
     * @param issuerUsername The issuer's username
     * @return List of pending certificate requests
     */
    List<CertificateRequestResponse> getPendingRequests(String issuerUsername);

    /**
     * Get all requests for an issuer (including approved/rejected)
     *
     * @param issuerUsername The issuer's username
     * @return List of all certificate requests
     */
    List<CertificateRequestResponse> getAllRequestsForIssuer(String issuerUsername);

    /**
     * Approve a certificate request and issue the certificate
     *
     * @param requestId      The request ID
     * @param dto            The approval details
     * @param issuerUsername The issuer's username
     * @return The updated request
     */
    CertificateRequestResponse approveRequest(UUID requestId, ApproveCertificateRequestDto dto, String issuerUsername);

    /**
     * Reject a certificate request
     *
     * @param requestId      The request ID
     * @param dto            The rejection details
     * @param issuerUsername The issuer's username
     * @return The updated request
     */
    CertificateRequestResponse rejectRequest(UUID requestId, RejectCertificateRequestDto dto, String issuerUsername);
}
