package com.prahlad.ecommerce.dto.order;

public record OrderItemDTO(

        Long productId,

        String productName,

        String productImage,

        String selectedColor,

        int quantity,

        double price,
 
        double mrp,
        
        int discountPercentage

) {}
