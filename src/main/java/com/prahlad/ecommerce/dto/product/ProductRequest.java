package com.prahlad.ecommerce.dto.product;

import jakarta.validation.constraints.*;

public record ProductRequest(

        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Description is required")
        String description,

        @Positive(message = "Price must be greater than 0")
        Double price,

        @Min(value = 0, message = "Stock cannot be negative")
        Integer stock,

        @NotNull(message = "Category is required")
        Long categoryId
) {}
