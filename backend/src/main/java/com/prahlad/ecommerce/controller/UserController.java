package com.prahlad.ecommerce.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
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
@PreAuthorize("hasAnyRole('USER')")
public class UserController 
{

	private final UserService userService;

	// ======================
	// GET PROFILE
	// ======================
	@GetMapping("/profile")
	public ResponseEntity<ApiResponse<UserResponse>> getProfile(Authentication authentication) 
	{

		UserResponse response = userService.getProfile(authentication.getName());

		return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", response));
	}

	// ======================
	// UPDATE PROFILE
	// ======================
	@PutMapping("/profile")
	public ResponseEntity<ApiResponse<UserResponse>> updateProfile(Authentication authentication,
			@RequestBody UserUpdateRequest request) 
	{

		UserResponse response = userService.updateProfile(authentication.getName(), request);

		return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
	}

	// ======================
	// CHANGE PASSWORD (NO OTP)
	// ======================
	@PutMapping("/change-password")
	public ResponseEntity<ApiResponse<String>> changePassword(Authentication authentication,
			@RequestBody Map<String, String> request)
	{

		String oldPassword = request.get("oldPassword");
		String newPassword = request.get("newPassword");

		String result = userService.changePassword(authentication.getName(), oldPassword, newPassword);

		return ResponseEntity.ok(ApiResponse.success(result, null));
	}

	// ======================
	// DELETE ACCOUNT
	// ======================
	
	@PostMapping("/delete/request")
	public ApiResponse<String> requestDeleteAccount(Authentication authentication) 
	{

		String email = authentication.getName();

		userService.requestDeleteAccount(email);

		return ApiResponse.success("OTP sent for account deletion", null);
	}

	@DeleteMapping("/delete")
	public ApiResponse<String> deleteAccount(@RequestParam String otp, Authentication authentication) 
	{

		String email = authentication.getName();

		userService.deleteAccount(email, otp);

		return ApiResponse.success("Account deleted successfully", null);
	}
}