package com.adtech.campaign.service;

import com.adtech.campaign.dto.CreateCampaignRequest;
import com.adtech.campaign.dto.CampaignResponse;
import com.adtech.campaign.dto.PagedResponse;
import com.adtech.campaign.exception.CampaignNotFoundException;
import com.adtech.campaign.exception.InvalidStatusTransitionException;
import com.adtech.campaign.kafka.CampaignEventPublisher;
import com.adtech.campaign.model.Campaign;
import com.adtech.campaign.model.CampaignStatus;
import com.adtech.campaign.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignEventPublisher eventPublisher;

    // Valid transitions: from → allowed-next-states
    private static final Map<CampaignStatus, Set<CampaignStatus>> VALID_TRANSITIONS = Map.of(
        CampaignStatus.DRAFT,          Set.of(CampaignStatus.PENDING_REVIEW, CampaignStatus.CANCELLED),
        CampaignStatus.PENDING_REVIEW, Set.of(CampaignStatus.ACTIVE, CampaignStatus.REJECTED, CampaignStatus.CANCELLED),
        CampaignStatus.ACTIVE,         Set.of(CampaignStatus.PAUSED, CampaignStatus.COMPLETED, CampaignStatus.CANCELLED),
        CampaignStatus.PAUSED,         Set.of(CampaignStatus.ACTIVE, CampaignStatus.CANCELLED),
        CampaignStatus.COMPLETED,      Set.of(),
        CampaignStatus.REJECTED,       Set.of(CampaignStatus.DRAFT),
        CampaignStatus.CANCELLED,      Set.of()
    );

    @Transactional
    public CampaignResponse create(String advertiserId, CreateCampaignRequest request) {
        Campaign campaign = Campaign.builder()
            .advertiserId(advertiserId)
            .name(request.getName())
            .description(request.getDescription())
            .totalBudget(request.getTotalBudget())
            .dailyBudgetCap(request.getDailyBudgetCap())
            .objective(request.getObjective())
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .audienceConfig(request.getAudienceConfig())
            .build();

        Campaign saved = campaignRepository.save(campaign);
        log.info("Campaign created: id={}, advertiser={}", saved.getId(), advertiserId);
        eventPublisher.publishLifecycleEvent(saved, "CREATED");
        return CampaignResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public CampaignResponse getById(UUID id, String advertiserId) {
        Campaign campaign = findAndVerifyOwnership(id, advertiserId);
        return CampaignResponse.from(campaign);
    }

    @Transactional(readOnly = true)
    public PagedResponse<CampaignResponse> listByAdvertiser(String advertiserId,
                                                             CampaignStatus status,
                                                             Pageable pageable) {
        var page = (status != null)
            ? campaignRepository.findByAdvertiserIdAndStatus(advertiserId, status, pageable)
            : campaignRepository.findByAdvertiserId(advertiserId, pageable);
        return PagedResponse.from(page.map(CampaignResponse::from));
    }

    @Transactional
    public CampaignResponse updateStatus(UUID id, String advertiserId, CampaignStatus newStatus) {
        Campaign campaign = findAndVerifyOwnership(id, advertiserId);
        validateTransition(campaign.getStatus(), newStatus);

        CampaignStatus oldStatus = campaign.getStatus();
        campaign.setStatus(newStatus);
        Campaign saved = campaignRepository.save(campaign);

        log.info("Campaign {} status: {} → {}", id, oldStatus, newStatus);
        eventPublisher.publishLifecycleEvent(saved, "STATUS_CHANGED");
        return CampaignResponse.from(saved);
    }

    private Campaign findAndVerifyOwnership(UUID id, String advertiserId) {
        Campaign campaign = campaignRepository.findById(id)
            .orElseThrow(() -> new CampaignNotFoundException(id));
        if (!campaign.getAdvertiserId().equals(advertiserId)) {
            throw new CampaignNotFoundException(id); // Don't leak existence to other advertisers
        }
        return campaign;
    }

    private void validateTransition(CampaignStatus current, CampaignStatus next) {
        Set<CampaignStatus> allowed = VALID_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowed.contains(next)) {
            throw new InvalidStatusTransitionException(current, next);
        }
    }
}
