package com.prahlad.ecommerce.dto.merchant;

public record MerchantResponse(
        Long id,
        String businessName,
        boolean approved,
        boolean active
) {}