package com.prahlad.ecommerce.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.merchant.MerchantResponse;
import com.prahlad.ecommerce.dto.merchant.MerchantUpdateRequest;
import com.prahlad.ecommerce.service.merchant.MerchantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/merchant")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantController 
{

	private final MerchantService merchantService;

	@GetMapping("/profile")
	public ApiResponse<MerchantResponse> getProfile(Authentication auth) 
	{
		return ApiResponse.success("Merchant profile fetched", merchantService.getProfile(auth.getName()));
	}

	@PutMapping("/profile")
	public ApiResponse<MerchantResponse> updateProfile(Authentication auth,
			@Valid @RequestBody MerchantUpdateRequest request) 
	{

		return ApiResponse.success("Profile updated successfully",
				merchantService.updateProfile(auth.getName(), request));
	}

	@PostMapping("/delete/request")
	public ApiResponse<String> requestDelete(Authentication authentication) 
	{

		String email = authentication.getName();

		merchantService.requestDeleteAccount(email);

		return ApiResponse.success("OTP sent for merchant account deletion", null);
	}

	@DeleteMapping("/delete")
	public ApiResponse<String> deleteAccount(@RequestParam String otp, Authentication authentication) 
	{

		String email = authentication.getName();

		merchantService.deleteAccount(email, otp);

		return ApiResponse.success("Merchant account deleted successfully", null);
	}
}