package com.adtech.campaign.repository;

import com.adtech.campaign.model.Campaign;
import com.adtech.campaign.model.CampaignStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, UUID> {

    Page<Campaign> findByAdvertiserId(String advertiserId, Pageable pageable);

    Page<Campaign> findByAdvertiserIdAndStatus(String advertiserId, CampaignStatus status, Pageable pageable);

    List<Campaign> findByStatusAndStartDateLessThanEqual(CampaignStatus status, LocalDateTime now);

    List<Campaign> findByStatusAndEndDateLessThanEqual(CampaignStatus status, LocalDateTime now);

    // Atomic budget deduction — uses optimistic lock via @Version on entity
    @Modifying
    @Query("""
        UPDATE Campaign c SET c.spentBudget = c.spentBudget + :amount
        WHERE c.id = :id AND (c.spentBudget + :amount) <= c.totalBudget
    """)
    int deductBudget(@Param("id") UUID id, @Param("amount") BigDecimal amount);

    @Query("SELECT COUNT(c) FROM Campaign c WHERE c.advertiserId = :advertiserId AND c.status = :status")
    long countByAdvertiserIdAndStatus(@Param("advertiserId") String advertiserId,
                                      @Param("status") CampaignStatus status);
}
