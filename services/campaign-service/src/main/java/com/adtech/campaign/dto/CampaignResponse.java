package com.adtech.campaign.dto;

import com.adtech.campaign.model.Campaign;
import com.adtech.campaign.model.CampaignObjective;
import com.adtech.campaign.model.CampaignStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CampaignResponse {
    private UUID id;
    private String name;
    private String description;
    private String advertiserId;
    private CampaignStatus status;
    private BigDecimal totalBudget;
    private BigDecimal spentBudget;
    private BigDecimal remainingBudget;
    private BigDecimal dailyBudgetCap;
    private CampaignObjective objective;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CampaignResponse from(Campaign c) {
        CampaignResponse r = new CampaignResponse();
        r.setId(c.getId());
        r.setName(c.getName());
        r.setDescription(c.getDescription());
        r.setAdvertiserId(c.getAdvertiserId());
        r.setStatus(c.getStatus());
        r.setTotalBudget(c.getTotalBudget());
        r.setSpentBudget(c.getSpentBudget());
        r.setRemainingBudget(c.remainingBudget());
        r.setDailyBudgetCap(c.getDailyBudgetCap());
        r.setObjective(c.getObjective());
        r.setStartDate(c.getStartDate());
        r.setEndDate(c.getEndDate());
        r.setCreatedAt(c.getCreatedAt());
        r.setUpdatedAt(c.getUpdatedAt());
        return r;
    }
}
