package com.certifypro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private Long totalUsers;
    private Long totalCertificates;
    private Long activeIssuers;
    private Double monthlyGrowth;
    private List<UserRoleBreakdown> userBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserRoleBreakdown {
        private String role;
        private Long count;
        private Double percentage;
    }
}
