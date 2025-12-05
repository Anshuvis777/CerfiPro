package com.certifypro.dto.response;

import com.certifypro.entity.ProfileVisibility;
import com.certifypro.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String email;
    private String username;
    private UserRole role;
    private String avatar;
    private String bio;
    private Set<String> skills;
    private String organization;
    private String location;
    private String experience;
    private ProfileVisibility profileVisibility;
    private LocalDateTime createdAt;
}
