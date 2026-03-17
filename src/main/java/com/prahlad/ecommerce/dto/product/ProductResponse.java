package com.prahlad.ecommerce.dto.product;

public record ProductResponse(
        Long id,
        String name,
        String description,
        double price,
        int stock,
        String categoryName,
        String merchantName
) {}