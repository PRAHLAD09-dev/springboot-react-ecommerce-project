package com.prahlad.ecommerce.dto.merchant;

public record MerchantResponse(
        Long id,
        String businessName,
        String email,
        boolean approved,
        boolean active
) {}