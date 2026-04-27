package com.adtech.campaign.model;

/**
 * Campaign lifecycle states.
 * Valid transitions:
 *   DRAFT → PENDING_REVIEW → ACTIVE → PAUSED → COMPLETED
 *                          ↘ REJECTED
 *   ACTIVE → PAUSED → ACTIVE
 *   ACTIVE/PAUSED → CANCELLED
 */
public enum CampaignStatus {
    DRAFT,
    PENDING_REVIEW,
    ACTIVE,
    PAUSED,
    COMPLETED,
    REJECTED,
    CANCELLED
}
