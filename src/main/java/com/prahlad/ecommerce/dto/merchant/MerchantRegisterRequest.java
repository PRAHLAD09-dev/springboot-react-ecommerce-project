package com.prahlad.ecommerce.dto.merchant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MerchantRegisterRequest(

        @NotBlank(message = "Business name is required")
        String businessName,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        String email,
        
        @NotBlank(message = "OTP is required")
        String otp,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String password

) {}