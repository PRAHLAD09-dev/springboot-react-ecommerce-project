package com.prahlad.ecommerce.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.prahlad.ecommerce.dto.user.UserResponse;
import com.prahlad.ecommerce.dto.user.UserUpdateRequest;
import com.prahlad.ecommerce.service.user.UserService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserController 
{

	private final UserService userService;

	@GetMapping("/profile")
	public UserResponse getProfile(Authentication authentication) 
	{
		return userService.getProfile(authentication.getName());
	}

	@PutMapping("/profile")
	public UserResponse updateProfile(Authentication authentication, @RequestBody UserUpdateRequest user) 
	{
		return userService.updateProfile(authentication.getName(), user);
	}

	@PutMapping("/change-password")
	public String changePassword(Authentication authentication, @RequestBody Map<String, String> request) 
	{

		String oldPassword = request.get("oldPassword");
		String newPassword = request.get("newPassword");

		return userService.changePassword(authentication.getName(), oldPassword, newPassword);
	}

	@DeleteMapping("/account")
	public String deleteAccount(Authentication authentication) {
		userService.deleteAccount(authentication.getName());
		return "Account deleted";
	}
}
