package com.prahlad.ecommerce.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.prahlad.ecommerce.dto.merchant.MerchantResponse;
import com.prahlad.ecommerce.dto.merchant.MerchantUpdateRequest;
import com.prahlad.ecommerce.service.merchant.MerchantService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/merchant")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantController 
{

	private final MerchantService merchantService;

	@GetMapping("/profile")
	public MerchantResponse getProfile(Authentication auth) 
	{
		return merchantService.getProfile(auth.getName());
	}

	@PutMapping("/profile")
	public MerchantResponse updateProfile(Authentication auth, @RequestBody MerchantUpdateRequest merchant) 
	{
		return merchantService.updateProfile(auth.getName(), merchant);
	}

	@PutMapping("/change-password")
	public String changePassword(Authentication auth, @RequestBody Map<String, String> req) 
	{

		return merchantService.changePassword(auth.getName(), req.get("oldPassword"), req.get("newPassword"));
	}

	@DeleteMapping("/account")
	public String deleteAccount(Authentication auth) 
	{
		merchantService.deleteAccount(auth.getName());
		return "Merchant account deleted";
	}
}
