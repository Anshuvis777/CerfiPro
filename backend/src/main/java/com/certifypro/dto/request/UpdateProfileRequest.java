package com.certifypro.dto.request;

import com.certifypro.entity.ProfileVisibility;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(max = 500, message = "Bio must not exceed 500 characters")
    private String bio;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @Size(max = 100, message = "Organization must not exceed 100 characters")
    private String organization;

    @Size(max = 100, message = "Experience must not exceed 100 characters")
    private String experience;

    private Set<String> skills;

    private ProfileVisibility profileVisibility;
}
