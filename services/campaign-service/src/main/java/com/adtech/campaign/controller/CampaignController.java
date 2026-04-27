package com.adtech.campaign.controller;

import com.adtech.campaign.dto.CreateCampaignRequest;
import com.adtech.campaign.dto.CampaignResponse;
import com.adtech.campaign.dto.PagedResponse;
import com.adtech.campaign.model.CampaignStatus;
import com.adtech.campaign.service.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/campaigns")
@RequiredArgsConstructor
@Tag(name = "Campaigns", description = "Campaign lifecycle management")
@SecurityRequirement(name = "bearerAuth")
public class CampaignController {

    private final CampaignService campaignService;

    @PostMapping
    @Operation(summary = "Create a new campaign")
    public ResponseEntity<CampaignResponse> create(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody CreateCampaignRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(campaignService.create(user.getUsername(), request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get campaign by ID")
    public ResponseEntity<CampaignResponse> getById(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable UUID id) {
        return ResponseEntity.ok(campaignService.getById(id, user.getUsername()));
    }

    @GetMapping
    @Operation(summary = "List campaigns for authenticated advertiser")
    public ResponseEntity<PagedResponse<CampaignResponse>> list(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(required = false) CampaignStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(campaignService.listByAdvertiser(user.getUsername(), status, pageable));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Transition campaign status")
    public ResponseEntity<CampaignResponse> updateStatus(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable UUID id,
            @RequestParam CampaignStatus status) {
        return ResponseEntity.ok(campaignService.updateStatus(id, user.getUsername(), status));
    }
}
