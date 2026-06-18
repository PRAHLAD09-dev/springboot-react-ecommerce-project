package com.prahlad.ecommerce.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(

        @NotBlank(message = "Name is required")
        @Size(
                min = 3,
                max = 50,
                message = "Name must be between 3 and 50 characters"
        )
        String name

) {}