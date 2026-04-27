package com.adtech.campaign.exception;

import com.adtech.campaign.model.CampaignStatus;

public class InvalidStatusTransitionException extends RuntimeException {
    public InvalidStatusTransitionException(CampaignStatus from, CampaignStatus to) {
        super("Invalid transition: " + from + " → " + to);
    }
}
