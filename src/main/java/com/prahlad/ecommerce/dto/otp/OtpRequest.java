package com.prahlad.ecommerce.dto.otp;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record OtpRequest(
		
		@Email(message = "Invalid email format")
	    @NotBlank(message = "Email is required")
		String email
		){}