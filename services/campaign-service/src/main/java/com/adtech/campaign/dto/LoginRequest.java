package com.adtech.campaign.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Advertiser ID is required")
    private String advertiserId;
}
