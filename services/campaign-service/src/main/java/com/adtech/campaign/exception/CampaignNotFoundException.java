package com.adtech.campaign.exception;

import java.util.UUID;

public class CampaignNotFoundException extends RuntimeException {
    public CampaignNotFoundException(UUID id) {
        super("Campaign not found: " + id);
    }
}
