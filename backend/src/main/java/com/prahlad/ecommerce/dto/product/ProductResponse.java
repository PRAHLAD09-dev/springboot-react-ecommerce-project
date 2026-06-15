package com.prahlad.ecommerce.dto.product;

import java.util.List;

public record ProductResponse(

        Long id,

        String name,

        String aiDescription,

        String specificationsJson,

        String featureHighlightsJson,

        String seoKeywords,

        double price,

        int stock,

        Double averageRating,

        Integer totalReviews,

        String categoryName,

        String merchantName,

        List<String> imageUrls
) {}