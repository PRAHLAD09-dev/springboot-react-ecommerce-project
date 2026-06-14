package com.prahlad.ecommerce.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateReviewRequest(

        @Min(1)
        @Max(5)
        Integer rating,

        @NotBlank
        String comment

) {}