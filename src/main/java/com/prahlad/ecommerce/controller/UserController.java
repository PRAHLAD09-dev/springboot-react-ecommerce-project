package com.prahlad.ecommerce.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.user.UserResponse;
import com.prahlad.ecommerce.dto.user.UserUpdateRequest;
import com.prahlad.ecommerce.service.user.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserController 
{

	private final UserService userService;

	@GetMapping("/profile")
	public ApiResponse<UserResponse> getProfile(Authentication authentication) 
	{

		UserResponse response = userService.getProfile(authentication.getName());

		return ApiResponse.success("Profile fetched successfully", response);
	}

	@PutMapping("/profile")
	public ApiResponse<UserResponse> updateProfile(Authentication authentication, @RequestBody UserUpdateRequest user) 
	{

		UserResponse response = userService.updateProfile(authentication.getName(), user);

		return ApiResponse.success("Profile updated successfully", response);
	}

	@PutMapping("/change-password")
	public ApiResponse<String> changePassword(Authentication authentication, @RequestBody Map<String, String> request) 
	{

		String result = userService.changePassword(authentication.getName(), request.get("oldPassword"),
				request.get("newPassword"));

		return ApiResponse.success(result, null);
	}

	@DeleteMapping("/account")
	public ApiResponse<String> deleteAccount(Authentication authentication) 
	{

		userService.deleteAccount(authentication.getName());

		return ApiResponse.success("Account deleted successfully", null);
	}
}