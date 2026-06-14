package com.prahlad.ecommerce.dto.ai;

import java.util.List;

public record AIProductResponse(

        String productName,

        String aiDescription,

        List<String> specifications,

        List<String> featureHighlights,

        List<String> seoKeywords
) {}