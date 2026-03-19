package com.prahlad.ecommerce.dto.cart;

public record CartItemDTO(
    Long productId,
    String productName,
    int quantity,
    double price
) {}