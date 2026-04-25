package com.prahlad.ecommerce.dto.merchant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record MerchantRegisterRequest(

        @NotBlank(message = "Business name is required")
        String businessName,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        String email,
        
        @NotBlank(message = "OTP is required")
        String otp

) {}