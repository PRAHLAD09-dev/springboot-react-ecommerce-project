package com.prahlad.ecommerce.controller;

import java.util.Map;

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
			@Valid @RequestBody MerchantUpdateRequest merchant) 
	{

		return ApiResponse.success("Profile updated successfully",
				merchantService.updateProfile(auth.getName(), merchant));
	}

	@PutMapping("/change-password")
	public ApiResponse<String> changePassword(Authentication auth, @RequestBody Map<String, String> req) 
	{

		return ApiResponse.success(
				merchantService.changePassword(auth.getName(), req.get("oldPassword"), req.get("newPassword")), null);
	}

	@DeleteMapping("/account")
	public ApiResponse<String> deleteAccount(Authentication auth) 
	{

		merchantService.deleteAccount(auth.getName());

		return ApiResponse.success("Merchant account deleted successfully", null);
	}
}