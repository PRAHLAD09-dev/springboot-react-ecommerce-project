package com.prahlad.ecommerce.dto.herobanner;

public record HeroBannerResponse(

        Long id,

        Long productId,

        String productName,

        String imageUrl,

        Integer position,

        boolean active

) {}