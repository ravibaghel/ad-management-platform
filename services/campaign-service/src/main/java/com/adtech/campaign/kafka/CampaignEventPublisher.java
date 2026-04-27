package com.adtech.campaign.kafka;

import com.adtech.campaign.model.Campaign;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class CampaignEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public static final String TOPIC_LIFECYCLE = "campaign-lifecycle-events";

    public void publishLifecycleEvent(Campaign campaign, String eventType) {
        var event = Map.of(
            "eventType", eventType,
            "campaignId", campaign.getId().toString(),
            "advertiserId", campaign.getAdvertiserId(),
            "status", campaign.getStatus().name(),
            "timestamp", Instant.now().toString()
        );

        kafkaTemplate.send(TOPIC_LIFECYCLE, campaign.getId().toString(), event)
            .whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish lifecycle event for campaign {}: {}",
                        campaign.getId(), ex.getMessage());
                } else {
                    log.debug("Published {} event for campaign {}", eventType, campaign.getId());
                }
            });
    }
}
