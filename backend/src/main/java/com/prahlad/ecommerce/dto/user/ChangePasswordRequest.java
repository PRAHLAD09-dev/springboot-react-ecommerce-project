package com.prahlad.ecommerce.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(

        @NotBlank(message = "Old password is required")
        String oldPassword,

        @NotBlank(message = "New password is required")

        @Size(
                min = 8,
                max = 20,
                message = "Password must be between 8 and 20 characters"
        )

        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,20}$",
                message = "Password must contain uppercase, lowercase, number and special character"
        )
        String newPassword

) {}