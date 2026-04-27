package com.adtech.campaign.dto;

import com.adtech.campaign.model.CampaignObjective;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CreateCampaignRequest {

    @NotBlank(message = "Campaign name is required")
    @Size(min = 3, max = 255)
    private String name;

    @Size(max = 1000)
    private String description;

    @NotNull(message = "Total budget is required")
    @DecimalMin(value = "1.00", message = "Minimum budget is $1.00")
    @Digits(integer = 13, fraction = 2)
    private BigDecimal totalBudget;

    @DecimalMin(value = "0.01")
    @Digits(integer = 13, fraction = 2)
    private BigDecimal dailyBudgetCap;

    @NotNull(message = "Campaign objective is required")
    private CampaignObjective objective;

    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private String audienceConfig; // JSON string
}
