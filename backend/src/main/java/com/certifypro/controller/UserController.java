package com.certifypro.controller;

import com.certifypro.dto.response.ApiResponse;
import com.certifypro.dto.response.UserResponse;
import com.certifypro.entity.User;
import com.certifypro.exception.ResourceNotFoundException;
import com.certifypro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUserProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserResponse response = convertToUserResponse(user);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
    }

    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserResponse response = convertToUserResponse(user);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
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
                        .map(skill -> skill.getName())
                        .collect(Collectors.toSet()))
                .organization(user.getOrganization())
                .location(user.getLocation())
                .experience(user.getExperience())
                .profileVisibility(user.getProfileVisibility())
                .build();
    }
}
