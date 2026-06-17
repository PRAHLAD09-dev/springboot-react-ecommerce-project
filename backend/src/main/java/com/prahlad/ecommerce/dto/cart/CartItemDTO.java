package com.prahlad.ecommerce.dto.cart;

public record CartItemDTO(
        Long cartItemId,
        Long productId,
        String productName,
        String imageUrl,
        String selectedColor,
        int quantity,
        double price,
        double mrp,
        int discountPercentage
) {}