package com.prahlad.ecommerce.dto.product;

import jakarta.validation.constraints.*;

public record ProductRequest(

        @Positive(message = "Price must be greater than 0")
        Double price,

        @Min(value = 0, message = "Stock cannot be negative")
        Integer stock,

        @NotNull(message = "Category is required")
        Long categoryId,

        String color
) {}