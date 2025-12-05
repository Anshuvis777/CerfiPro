package com.certifypro.service;

import com.certifypro.dto.request.ApproveCertificateRequestDto;
import com.certifypro.dto.request.CertificateRequest;
import com.certifypro.dto.request.CreateCertificateRequestDto;
import com.certifypro.dto.request.RejectCertificateRequestDto;
import com.certifypro.dto.response.CertificateRequestResponse;
import com.certifypro.entity.Skill;
import com.certifypro.entity.User;
import com.certifypro.exception.ResourceNotFoundException;
import com.certifypro.repository.CertificateRequestRepository;
import com.certifypro.repository.SkillRepository;
import com.certifypro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateRequestServiceImpl implements CertificateRequestService {

        private final CertificateRequestRepository requestRepository;
        private final UserRepository userRepository;
        private final SkillRepository skillRepository;
        private final CertificateService certificateService;

        @Override
        @Transactional
        public CertificateRequestResponse createRequest(String requesterUsername, CreateCertificateRequestDto dto) {
                User requester = userRepository.findByUsername(requesterUsername)
                                .orElseThrow(() -> new ResourceNotFoundException("Requester not found"));

                User issuer = userRepository.findByUsername(dto.getIssuerUsername())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Issuer not found: " + dto.getIssuerUsername()));

                // Get or create skills
                Set<Skill> skills = new HashSet<>();
                for (String skillName : dto.getSkills()) {
                        Skill skill = skillRepository.findByName(skillName)
                                        .orElseGet(() -> {
                                                Skill newSkill = new Skill();
                                                newSkill.setName(skillName);
                                                return skillRepository.save(newSkill);
                                        });
                        skills.add(skill);
                }

                com.certifypro.entity.CertificateRequest request = com.certifypro.entity.CertificateRequest.builder()
                                .requester(requester)
                                .issuer(issuer)
                                .requestMessage(dto.getRequestMessage())
                                .skills(skills)
                                .status(com.certifypro.entity.CertificateRequest.RequestStatus.PENDING)
                                .build();

                com.certifypro.entity.CertificateRequest savedRequest = requestRepository.save(request);
                return convertToResponse(savedRequest);
        }

        @Override
        @Transactional(readOnly = true)
        public List<CertificateRequestResponse> getMyRequests(String username) {
                User requester = userRepository.findByUsername(username)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                return requestRepository.findByRequesterOrderByRequestedAtDesc(requester)
                                .stream()
                                .map(this::convertToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional(readOnly = true)
        public List<CertificateRequestResponse> getPendingRequests(String issuerUsername) {
                User issuer = userRepository.findByUsername(issuerUsername)
                                .orElseThrow(() -> new ResourceNotFoundException("Issuer not found"));

                return requestRepository
                                .findByIssuerAndStatus(issuer,
                                                com.certifypro.entity.CertificateRequest.RequestStatus.PENDING)
                                .stream()
                                .map(this::convertToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional(readOnly = true)
        public List<CertificateRequestResponse> getAllRequestsForIssuer(String issuerUsername) {
                User issuer = userRepository.findByUsername(issuerUsername)
                                .orElseThrow(() -> new ResourceNotFoundException("Issuer not found"));

                return requestRepository.findByIssuerOrderByRequestedAtDesc(issuer)
                                .stream()
                                .map(this::convertToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public CertificateRequestResponse approveRequest(UUID requestId, ApproveCertificateRequestDto dto,
                        String issuerUsername) {
                User issuer = userRepository.findByUsername(issuerUsername)
                                .orElseThrow(() -> new ResourceNotFoundException("Issuer not found"));

                com.certifypro.entity.CertificateRequest request = requestRepository
                                .findByIdAndIssuer(requestId, issuer)
                                .orElseThrow(() -> new ResourceNotFoundException("Certificate request not found"));

                if (request.getStatus() != com.certifypro.entity.CertificateRequest.RequestStatus.PENDING) {
                        throw new IllegalStateException(
                                        "Request has already been " + request.getStatus().name().toLowerCase());
                }

                // Create certificate request DTO
                CertificateRequest certRequest = new CertificateRequest();
                certRequest.setName(dto.getCertificateName());
                certRequest.setDescription(dto.getDescription());
                certRequest.setRecipientEmail(request.getRequester().getEmail());
                certRequest.setIssuedDate(dto.getIssuedDate());
                certRequest.setExpiryDate(dto.getExpiryDate());
                certRequest.setSkills(request.getSkills().stream()
                                .map(Skill::getName)
                                .collect(Collectors.toSet()));

                // Issue the certificate
                certificateService.issueCertificate(certRequest, issuerUsername);

                // Update request status
                request.setStatus(com.certifypro.entity.CertificateRequest.RequestStatus.APPROVED);
                request.setRespondedAt(LocalDateTime.now());

                com.certifypro.entity.CertificateRequest updatedRequest = requestRepository.save(request);
                return convertToResponse(updatedRequest);
        }

        @Override
        @Transactional
        public CertificateRequestResponse rejectRequest(UUID requestId, RejectCertificateRequestDto dto,
                        String issuerUsername) {
                User issuer = userRepository.findByUsername(issuerUsername)
                                .orElseThrow(() -> new ResourceNotFoundException("Issuer not found"));

                com.certifypro.entity.CertificateRequest request = requestRepository
                                .findByIdAndIssuer(requestId, issuer)
                                .orElseThrow(() -> new ResourceNotFoundException("Certificate request not found"));

                if (request.getStatus() != com.certifypro.entity.CertificateRequest.RequestStatus.PENDING) {
                        throw new IllegalStateException(
                                        "Request has already been " + request.getStatus().name().toLowerCase());
                }

                request.setStatus(com.certifypro.entity.CertificateRequest.RequestStatus.REJECTED);
                request.setRejectionReason(dto.getRejectionReason());
                request.setRespondedAt(LocalDateTime.now());

                com.certifypro.entity.CertificateRequest updatedRequest = requestRepository.save(request);
                return convertToResponse(updatedRequest);
        }

        private CertificateRequestResponse convertToResponse(com.certifypro.entity.CertificateRequest request) {
                return CertificateRequestResponse.builder()
                                .id(request.getId())
                                .requesterUsername(request.getRequester().getUsername())
                                .requesterEmail(request.getRequester().getEmail())
                                .issuerUsername(request.getIssuer().getUsername())
                                .requestMessage(request.getRequestMessage())
                                .skills(request.getSkills().stream()
                                                .map(Skill::getName)
                                                .collect(Collectors.toSet()))
                                .status(request.getStatus())
                                .requestedAt(request.getRequestedAt())
                                .respondedAt(request.getRespondedAt())
                                .rejectionReason(request.getRejectionReason())
                                .paymentAmount(request.getPaymentAmount())
                                .isPaid(request.getIsPaid())
                                .paymentTransactionId(request.getPaymentTransactionId())
                                .paidAt(request.getPaidAt())
                                .build();
        }
}
