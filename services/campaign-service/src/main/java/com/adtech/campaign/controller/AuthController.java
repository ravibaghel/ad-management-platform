package com.adtech.campaign.controller;

import com.adtech.campaign.config.JwtService;
import com.adtech.campaign.dto.AuthResponse;
import com.adtech.campaign.dto.LoginRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Advertiser authentication")
public class AuthController {

    private final JwtService jwtService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate advertiser and get JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = jwtService.generateToken(request.getAdvertiserId());
        return ResponseEntity.status(HttpStatus.OK)
            .body(new AuthResponse(token, request.getAdvertiserId()));
    }
}
