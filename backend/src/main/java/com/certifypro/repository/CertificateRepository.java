package com.certifypro.repository;

import com.certifypro.entity.Certificate;
import com.certifypro.entity.CertificateStatus;
import com.certifypro.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {

    List<Certificate> findByHolder(User holder);

    List<Certificate> findByIssuer(User issuer);

    Page<Certificate> findByHolder(User holder, Pageable pageable);

    Page<Certificate> findByIssuer(User issuer, Pageable pageable);

    List<Certificate> findByStatus(CertificateStatus status);

    Optional<Certificate> findByBlockchainHash(String blockchainHash);

    @Query("SELECT c FROM Certificate c WHERE c.holder = :holder AND c.status = :status")
    List<Certificate> findByHolderAndStatus(@Param("holder") User holder,
            @Param("status") CertificateStatus status);

    @Query("SELECT c FROM Certificate c WHERE c.issuer = :issuer AND c.status = :status")
    List<Certificate> findByIssuerAndStatus(@Param("issuer") User issuer,
            @Param("status") CertificateStatus status);

    @Query("SELECT c FROM Certificate c JOIN c.skills s WHERE s.name IN :skillNames")
    List<Certificate> findBySkillsIn(@Param("skillNames") List<String> skillNames);

    @Query("SELECT c FROM Certificate c WHERE c.expiryDate BETWEEN :startDate AND :endDate")
    List<Certificate> findExpiringBetween(@Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT c FROM Certificate c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Certificate> searchByName(@Param("query") String query);

    @Query("SELECT COUNT(c) FROM Certificate c WHERE c.issuer = :issuer")
    Long countByIssuer(@Param("issuer") User issuer);

    @Query("SELECT COUNT(c) FROM Certificate c WHERE c.holder = :holder")
    Long countByHolder(@Param("holder") User holder);

    @Query("SELECT COUNT(c) FROM Certificate c WHERE c.issuer = :issuer AND c.createdAt >= :startDate")
    Long countByIssuerAndCreatedAtAfter(@Param("issuer") User issuer,
            @Param("startDate") java.time.LocalDateTime startDate);
}
