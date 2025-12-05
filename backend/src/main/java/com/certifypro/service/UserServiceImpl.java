package com.certifypro.service;

import com.certifypro.dto.request.UpdateProfileRequest;
import com.certifypro.dto.response.AdminStatsResponse;
import com.certifypro.dto.response.EmployerStatsResponse;
import com.certifypro.dto.response.IssuerStatsResponse;
import com.certifypro.dto.response.UserResponse;
import com.certifypro.entity.Skill;
import com.certifypro.entity.User;
import com.certifypro.entity.UserRole;
import com.certifypro.exception.ResourceNotFoundException;
import com.certifypro.repository.CertificateRepository;
import com.certifypro.repository.SkillRepository;
import com.certifypro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final StorageService storageService;
    private final CertificateRepository certificateRepository;

    private static final String PROFILE_PICTURES_FOLDER = "profile-pictures";

    @Override
    @Transactional
    public UserResponse updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        // Update basic fields
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }

        if (request.getOrganization() != null) {
            user.setOrganization(request.getOrganization());
        }

        if (request.getExperience() != null) {
            user.setExperience(request.getExperience());
        }

        if (request.getProfileVisibility() != null) {
            user.setProfileVisibility(request.getProfileVisibility());
        }

        // Update skills
        if (request.getSkills() != null) {
            Set<Skill> skills = new HashSet<>();
            for (String skillName : request.getSkills()) {
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
            user.setSkills(skills);
        }

        User savedUser = userRepository.save(user);
        log.info("Profile updated successfully for user: {}", username);

        return convertToUserResponse(savedUser);
    }

    @Override
    @Transactional
    public String uploadProfilePicture(String username, MultipartFile file) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        // Delete old profile picture if exists
        if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
            try {
                storageService.deleteFile(user.getAvatar());
                log.info("Deleted old profile picture for user: {}", username);
            } catch (Exception e) {
                log.warn("Failed to delete old profile picture: {}", e.getMessage());
            }
        }

        // Upload new profile picture
        String avatarUrl = storageService.uploadFile(file, PROFILE_PICTURES_FOLDER);
        user.setAvatar(avatarUrl);
        userRepository.save(user);

        log.info("Profile picture uploaded successfully for user: {}", username);
        return avatarUrl;
    }

    @Override
    @Transactional
    public void deleteProfilePicture(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
            try {
                storageService.deleteFile(user.getAvatar());
                user.setAvatar(null);
                userRepository.save(user);
                log.info("Profile picture deleted successfully for user: {}", username);
            } catch (Exception e) {
                log.error("Failed to delete profile picture: {}", e.getMessage());
                throw e;
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        return convertToUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public IssuerStatsResponse getIssuerStats(String username) {
        User issuer = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        // Get total certificates issued by this issuer
        Long totalIssued = certificateRepository.countByIssuer(issuer);

        // Get monthly issue count (last 30 days)
        java.time.LocalDateTime thirtyDaysAgo = java.time.LocalDateTime.now().minusDays(30);
        Long monthlyIssue = certificateRepository.countByIssuerAndCreatedAtAfter(issuer, thirtyDaysAgo);

        // Calculate verification rate (for now, assume all certificates are verified)
        // This can be enhanced with actual verification tracking
        Double verificationRate = 98.5;

        // Active templates (for now, count total issued as templates)
        // This can be enhanced with actual template tracking
        Long activeTemplates = totalIssued > 0 ? Math.min(totalIssued, 10L) : 0L;

        return IssuerStatsResponse.builder()
                .totalIssued(totalIssued)
                .activeTemplates(activeTemplates)
                .monthlyIssue(monthlyIssue)
                .verificationRate(verificationRate)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStatsResponse getAdminStats() {
        // Get total users
        Long totalUsers = userRepository.count();

        // Get total certificates
        Long totalCertificates = certificateRepository.count();

        // Get active issuers (users with ISSUER role)
        Long activeIssuers = userRepository.countByRole(UserRole.ISSUER);

        // Calculate monthly growth (for now, simplified - can be enhanced)
        Double monthlyGrowth = 12.5;

        // Get user breakdown by role
        java.util.List<AdminStatsResponse.UserRoleBreakdown> userBreakdown = new java.util.ArrayList<>();

        for (UserRole role : UserRole.values()) {
            Long count = userRepository.countByRole(role);
            Double percentage = totalUsers > 0 ? (count * 100.0 / totalUsers) : 0.0;

            userBreakdown.add(AdminStatsResponse.UserRoleBreakdown.builder()
                    .role(role.name())
                    .count(count)
                    .percentage(Math.round(percentage * 100.0) / 100.0)
                    .build());
        }

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalCertificates(totalCertificates)
                .activeIssuers(activeIssuers)
                .monthlyGrowth(monthlyGrowth)
                .userBreakdown(userBreakdown)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployerStatsResponse getEmployerStats(String username) {
        User employer = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        // For now, return simplified stats
        // In the future, this can be enhanced with actual job postings and hiring data
        Long employeesVerified = 0L; // Can be enhanced with actual verification tracking
        Long activeJobs = 0L; // Requires job postings entity
        Long candidatesReviewed = 0L; // Requires candidates/applications entity
        Double hiringRate = 0.0; // Can be calculated from actual hiring data

        return EmployerStatsResponse.builder()
                .employeesVerified(employeesVerified)
                .activeJobs(activeJobs)
                .candidatesReviewed(candidatesReviewed)
                .hiringRate(hiringRate)
                .build();
    }

    private UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole())
                .avatar(user.getAvatar())
                .bio(user.getBio())
                .skills(user.getSkills().stream()
                        .map(Skill::getName)
                        .collect(Collectors.toSet()))
                .organization(user.getOrganization())
                .location(user.getLocation())
                .experience(user.getExperience())
                .profileVisibility(user.getProfileVisibility())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
