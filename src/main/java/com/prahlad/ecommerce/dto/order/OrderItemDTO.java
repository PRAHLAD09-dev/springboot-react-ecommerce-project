package com.prahlad.ecommerce.dto.order;

public record OrderItemDTO(
        String productName,
        int quantity,
        double price
) {}
