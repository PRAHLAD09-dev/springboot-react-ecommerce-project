package com.prahlad.ecommerce.dto.auth;

public record ResetPasswordRequest(
		     String email,
		     String otp,
		     String newPassword
		)

{}

