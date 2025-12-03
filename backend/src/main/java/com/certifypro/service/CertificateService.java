package com.certifypro.service;

import com.certifypro.dto.request.CertificateRequest;
import com.certifypro.dto.response.CertificateResponse;
import com.certifypro.entity.Certificate;
import com.certifypro.entity.CertificateStatus;
import com.certifypro.entity.Skill;
import com.certifypro.entity.User;
import com.certifypro.exception.BadRequestException;
import com.certifypro.exception.ResourceNotFoundException;
import com.certifypro.exception.UnauthorizedException;
import com.certifypro.repository.CertificateRepository;
import com.certifypro.repository.SkillRepository;
import com.certifypro.repository.UserRepository;
import com.certifypro.util.BlockchainUtil;
import com.certifypro.util.QRCodeGenerator;
import com.google.zxing.WriterException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final QRCodeGenerator qrCodeGenerator;
    private final BlockchainUtil blockchainUtil;

    @Transactional
    public CertificateResponse issueCertificate(CertificateRequest request, String issuerUsername) {
        // Get issuer
        User issuer = userRepository.findByUsername(issuerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Issuer not found"));

        // Get or create holder by email
        User holder = userRepository.findByEmail(request.getRecipientEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found. User must register first."));

        // Get or create skills
        Set<Skill> skills = getOrCreateSkills(request.getSkills());

        // Create certificate
        Certificate certificate = Certificate.builder()
                .name(request.getName())
                .description(request.getDescription())
                .issuedDate(request.getIssuedDate())
                .expiryDate(request.getExpiryDate())
                .status(CertificateStatus.ACTIVE)
                .holder(holder)
                .issuer(issuer)
                .skills(skills)
                .views(0)
                .build();

        certificate = certificateRepository.save(certificate);

        // Generate blockchain hash
        String blockchainHash = blockchainUtil.generateBlockchainHash(
                certificate.getId(),
                holder.getEmail(),
                issuer.getEmail(),
                certificate.getName());
        certificate.setBlockchainHash(blockchainHash);

        // Generate QR code
        try {
            String qrCodeData = "https://certifypro.com/verify/" + certificate.getId();
            String qrCode = qrCodeGenerator.generateQRCodeBase64(qrCodeData);
            certificate.setQrCode(qrCode);
        } catch (WriterException | IOException e) {
            // Log error but don't fail the certificate creation
            System.err.println("Failed to generate QR code: " + e.getMessage());
        }

        certificate = certificateRepository.save(certificate);

        return convertToCertificateResponse(certificate);
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> getUserCertificates(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Certificate> certificates = certificateRepository.findByHolder(user);
        return certificates.stream()
                .map(this::convertToCertificateResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CertificateResponse> getIssuedCertificates(String issuerUsername) {
        User issuer = userRepository.findByUsername(issuerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Issuer not found"));

        List<Certificate> certificates = certificateRepository.findByIssuer(issuer);
        return certificates.stream()
                .map(this::convertToCertificateResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CertificateResponse getCertificateById(UUID id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));

        // Increment view count
        certificate.incrementViews();
        certificateRepository.save(certificate);

        return convertToCertificateResponse(certificate);
    }

    @Transactional
    public void revokeCertificate(UUID id, String issuerUsername) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));

        // Verify issuer
        if (!certificate.getIssuer().getUsername().equals(issuerUsername)) {
            throw new UnauthorizedException("Only the issuer can revoke this certificate");
        }

        certificate.setStatus(CertificateStatus.REVOKED);
        certificateRepository.save(certificate);
    }

    @Transactional(readOnly = true)
    public CertificateResponse verifyCertificate(String certificateId) {
        UUID id;
        try {
            id = UUID.fromString(certificateId);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid certificate ID format");
        }

        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found or invalid"));

        // Verify blockchain hash
        if (!blockchainUtil.verifyBlockchainHash(certificate.getBlockchainHash())) {
            throw new BadRequestException("Certificate verification failed - invalid blockchain hash");
        }

        // Check if expired
        if (certificate.isExpired()) {
            certificate.setStatus(CertificateStatus.EXPIRED);
            certificateRepository.save(certificate);
        }

        return convertToCertificateResponse(certificate);
    }

    private Set<Skill> getOrCreateSkills(Set<String> skillNames) {
        Set<Skill> skills = new HashSet<>();
        for (String skillName : skillNames) {
            Skill skill = skillRepository.findByName(skillName)
                    .orElseGet(() -> {
                        Skill newSkill = Skill.builder()
                                .name(skillName)
                                .endorsements(0)
                                .build();
                        return skillRepository.save(newSkill);
                    });
            skills.add(skill);
        }
        return skills;
    }

    private CertificateResponse convertToCertificateResponse(Certificate certificate) {
        return CertificateResponse.builder()
                .id(certificate.getId())
                .name(certificate.getName())
                .description(certificate.getDescription())
                .issuedDate(certificate.getIssuedDate())
                .expiryDate(certificate.getExpiryDate())
                .status(certificate.getStatus())
                .blockchainHash(certificate.getBlockchainHash())
                .qrCode(certificate.getQrCode())
                .views(certificate.getViews())
                .holderName(certificate.getHolder().getUsername())
                .holderUsername(certificate.getHolder().getUsername())
                .issuerName(certificate.getIssuer().getUsername())
                .issuerOrganization(certificate.getIssuer().getOrganization())
                .skills(certificate.getSkills().stream()
                        .map(Skill::getName)
                        .collect(Collectors.toSet()))
                .build();
    }
}
