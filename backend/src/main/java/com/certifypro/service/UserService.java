package com.certifypro.service;

import com.certifypro.dto.request.UpdateProfileRequest;
import com.certifypro.dto.response.AdminStatsResponse;
import com.certifypro.dto.response.EmployerStatsResponse;
import com.certifypro.dto.response.IssuerStatsResponse;
import com.certifypro.dto.response.UserResponse;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for user-related operations
 */
public interface UserService {

    /**
     * Update user profile information
     * 
     * @param username The username of the user to update
     * @param request  The profile update request
     * @return Updated user response
     */
    UserResponse updateProfile(String username, UpdateProfileRequest request);

    /**
     * Upload or replace user profile picture
     * 
     * @param username The username of the user
     * @param file     The profile picture file
     * @return URL of the uploaded profile picture
     */
    String uploadProfilePicture(String username, MultipartFile file);

    /**
     * Delete user profile picture
     * 
     * @param username The username of the user
     */
    void deleteProfilePicture(String username);

    /**
     * Get user profile by username
     * 
     * @param username The username
     * @return User response
     */
    UserResponse getUserProfile(String username);

    /**
     * Get issuer statistics for a user
     * 
     * @param username The username of the issuer
     * @return Issuer statistics
     */
    IssuerStatsResponse getIssuerStats(String username);

    /**
     * Get admin statistics (system-wide)
     * 
     * @return Admin statistics
     */
    AdminStatsResponse getAdminStats();

    /**
     * Get employer statistics for a user
     * 
     * @param username The username of the employer
     * @return Employer statistics
     */
    EmployerStatsResponse getEmployerStats(String username);
}
