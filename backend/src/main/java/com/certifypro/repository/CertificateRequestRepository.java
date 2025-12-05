package com.certifypro.repository;

import com.certifypro.entity.CertificateRequest;
import com.certifypro.entity.CertificateRequest.RequestStatus;
import com.certifypro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CertificateRequestRepository extends JpaRepository<CertificateRequest, UUID> {

    List<CertificateRequest> findByRequesterAndStatus(User requester, RequestStatus status);

    List<CertificateRequest> findByIssuerAndStatus(User issuer, RequestStatus status);

    List<CertificateRequest> findByRequesterOrderByRequestedAtDesc(User requester);

    List<CertificateRequest> findByIssuerOrderByRequestedAtDesc(User issuer);

    Optional<CertificateRequest> findByIdAndIssuer(UUID id, User issuer);

    Long countByIssuerAndStatus(User issuer, RequestStatus status);
}
