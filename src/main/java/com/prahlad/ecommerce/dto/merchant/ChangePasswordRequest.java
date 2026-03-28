package com.prahlad.ecommerce.dto.merchant;

public record ChangePasswordRequest(
	    String oldPassword,
	    String newPassword
	) {}