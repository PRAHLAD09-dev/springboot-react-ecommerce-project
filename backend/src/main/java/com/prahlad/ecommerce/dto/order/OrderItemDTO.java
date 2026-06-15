package com.prahlad.ecommerce.dto.order;

public record OrderItemDTO(

        Long productId,

        String productName,

        String productImage,

        int quantity,

        double price

) {}
