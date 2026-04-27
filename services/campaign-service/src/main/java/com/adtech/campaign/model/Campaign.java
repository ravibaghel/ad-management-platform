package com.adtech.campaign.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "campaigns")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String advertiserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CampaignStatus status = CampaignStatus.DRAFT;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalBudget;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal spentBudget = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    private BigDecimal dailyBudgetCap;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampaignObjective objective;

    @Column(nullable = false)
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    // Audience targeting stored as JSONB in PostgreSQL
    @Column(columnDefinition = "jsonb")
    private String audienceConfig;

    // Creative references (MinIO object keys)
    @Column(columnDefinition = "jsonb")
    private String creativeIds;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Version
    private Long version; // optimistic locking — critical for budget updates

    public boolean hasRemainingBudget() {
        return spentBudget.compareTo(totalBudget) < 0;
    }

    public BigDecimal remainingBudget() {
        return totalBudget.subtract(spentBudget);
    }
}
