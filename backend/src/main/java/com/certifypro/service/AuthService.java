package com.certifypro.service;

import com.certifypro.dto.request.LoginRequest;
import com.certifypro.dto.request.RegisterRequest;
import com.certifypro.dto.response.AuthResponse;
import com.certifypro.dto.response.UserResponse;
import com.certifypro.entity.User;
import com.certifypro.exception.BadRequestException;
import com.certifypro.repository.UserRepository;
import com.certifypro.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .bio("New CertifyPro user")
                .enabled(true)
                .build();

        user = userRepository.save(user);

        // Generate JWT token
        String token = tokenProvider.generateTokenFromUsername(user.getUsername());

        // Convert to response
        UserResponse userResponse = convertToUserResponse(user);

        return AuthResponse.builder()
                .user(userResponse)
                .token(token)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        // Generate JWT token
        String token = tokenProvider.generateTokenFromUsername(user.getUsername());

        // Convert to response
        UserResponse userResponse = convertToUserResponse(user);

        return AuthResponse.builder()
                .user(userResponse)
                .token(token)
                .build();
    }

    @Transactional(readOnly = true)
    public UserResponse verifyToken(String token) {
        if (!tokenProvider.validateToken(token)) {
            throw new BadRequestException("Invalid token");
        }

        String username = tokenProvider.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("User not found"));

        return convertToUserResponse(user);
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
