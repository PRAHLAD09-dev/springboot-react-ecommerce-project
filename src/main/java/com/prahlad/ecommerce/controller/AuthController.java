package com.prahlad.ecommerce.controller;

import org.springframework.web.bind.annotation.*;
import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.auth.AuthResponse;
import com.prahlad.ecommerce.dto.auth.LoginRequest;
import com.prahlad.ecommerce.dto.merchant.MerchantRegisterRequest;
import com.prahlad.ecommerce.dto.user.UserRegisterRequest;
import com.prahlad.ecommerce.service.auth.AuthService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController 
{

	private final AuthService authService;

	@PostMapping("/user/register")
	public ApiResponse<AuthResponse> registerUser(@RequestBody UserRegisterRequest request) 
	{

		AuthResponse response = authService.registerUser(request);

		return ApiResponse.success("User registered successfully", response);
	}

	@PostMapping("/merchant/register")
	public ApiResponse<AuthResponse> registerMerchant(@RequestBody MerchantRegisterRequest request) 
	{

		AuthResponse response = authService.registerMerchant(request);

		return ApiResponse.success("Merchant registered successfully", response);
	}

	@PostMapping("/login")
	public ApiResponse<AuthResponse> login(@RequestBody LoginRequest request) 
	{

		AuthResponse response = authService.login(request);

		return ApiResponse.success("Login successful", response);
	}
}