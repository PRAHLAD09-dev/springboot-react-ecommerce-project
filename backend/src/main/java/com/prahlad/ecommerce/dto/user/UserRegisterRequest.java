package com.prahlad.ecommerce.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegisterRequest(

        @NotBlank(message = "Name is required")
        String name,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "OTP is required")
        String otp,
        
        @NotBlank(message = "Password is required")
        @Size(
                min = 8,
                max = 20,
                message = "Password must be between 8 and 20 characters"
        )
        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).+$",
                message = "Password must contain uppercase, lowercase and a number"
        )
        String password
        
       

) {}