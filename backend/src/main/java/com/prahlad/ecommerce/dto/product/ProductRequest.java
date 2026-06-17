package com.prahlad.ecommerce.dto.product;

import jakarta.validation.constraints.*;

import java.util.List;

public record ProductRequest(

        @Positive(message = "Price must be greater than 0")
        Double price,

        @Positive(message = "MRP must be greater than 0")
        Double mrp,

        @Min(value = 0, message = "Stock cannot be negative")
        Integer stock,

        @NotNull(message = "Category is required")
        Long categoryId,

        List<String> colors

) {}