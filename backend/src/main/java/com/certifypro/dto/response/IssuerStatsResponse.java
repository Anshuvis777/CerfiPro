package com.certifypro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssuerStatsResponse {
    private Long totalIssued;
    private Long activeTemplates;
    private Long monthlyIssue;
    private Double verificationRate;
}
