package com.prahlad.ecommerce.dto.user;

public record ChangePasswordRequest(
        String oldPassword,
        String newPassword
) {}