package com.certifypro.controller;

import com.certifypro.dto.request.UpdateProfileRequest;
import com.certifypro.dto.response.AdminStatsResponse;
import com.certifypro.dto.response.ApiResponse;
import com.certifypro.dto.response.EmployerStatsResponse;
import com.certifypro.dto.response.IssuerStatsResponse;
import com.certifypro.dto.response.ProfilePictureUploadResponse;
import com.certifypro.dto.response.UserResponse;
import com.certifypro.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUserProfile(Authentication authentication) {
        String username = authentication.getName();
        UserResponse response = userService.getUserProfile(username);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
    }

    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(@PathVariable String username) {
        UserResponse response = userService.getUserProfile(username);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        String username = authentication.getName();
        UserResponse response = userService.updateProfile(username, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PostMapping("/profile/picture")
    public ResponseEntity<ApiResponse<ProfilePictureUploadResponse>> uploadProfilePicture(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        String username = authentication.getName();
        String avatarUrl = userService.uploadProfilePicture(username, file);

        ProfilePictureUploadResponse response = ProfilePictureUploadResponse.builder()
                .avatarUrl(avatarUrl)
                .message("Profile picture uploaded successfully")
                .build();

        return ResponseEntity.ok(ApiResponse.success("Profile picture uploaded successfully", response));
    }

    @DeleteMapping("/profile/picture")
    public ResponseEntity<ApiResponse<Void>> deleteProfilePicture(Authentication authentication) {
        String username = authentication.getName();
        userService.deleteProfilePicture(username);
        return ResponseEntity.ok(ApiResponse.success("Profile picture deleted successfully", null));
    }

    @GetMapping("/{username}/issuer-stats")
    public ResponseEntity<ApiResponse<IssuerStatsResponse>> getIssuerStats(@PathVariable String username) {
        IssuerStatsResponse response = userService.getIssuerStats(username);
        return ResponseEntity.ok(ApiResponse.success("Issuer stats retrieved successfully", response));
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getAdminStats() {
        AdminStatsResponse response = userService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success("Admin stats retrieved successfully", response));
    }

    @GetMapping("/{username}/employer-stats")
    public ResponseEntity<ApiResponse<EmployerStatsResponse>> getEmployerStats(@PathVariable String username) {
        EmployerStatsResponse response = userService.getEmployerStats(username);
        return ResponseEntity.ok(ApiResponse.success("Employer stats retrieved successfully", response));
    }
}
