package com.prahlad.ecommerce.dto.auth;

public record AuthResponse(
        String message,
        String email,
        String role,
        String token
) {}