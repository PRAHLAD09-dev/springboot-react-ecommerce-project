package com.prahlad.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.auth.AuthResponse;
import com.prahlad.ecommerce.dto.auth.LoginRequest;
import com.prahlad.ecommerce.dto.auth.ResetPasswordRequest;
import com.prahlad.ecommerce.dto.merchant.MerchantRegisterRequest;
import com.prahlad.ecommerce.dto.otp.OtpRequest;
import com.prahlad.ecommerce.dto.user.UserRegisterRequest;
import com.prahlad.ecommerce.enums.OTPType;
import com.prahlad.ecommerce.service.auth.AuthService;
import com.prahlad.ecommerce.service.otp.OtpService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController 
{

	private final AuthService authService;
	private final OtpService otpService;

	// ======================
	// SEND OTP
	// ======================
	@PostMapping("/send-otp")
	public ResponseEntity<ApiResponse<?>> sendOtp(@RequestBody OtpRequest request) 
	{

		otpService.generateOtp(request.email(), OTPType.REGISTER);

		return ResponseEntity.ok(ApiResponse.success("OTP sent successfully", null));
	}

	// ======================
	// USER REGISTER
	// ======================
	@PostMapping("/user/register")
	public ResponseEntity<ApiResponse<AuthResponse>> registerUser(@RequestBody UserRegisterRequest request) 
	{

		otpService.verifyOtp(request.email(), request.otp(), OTPType.REGISTER);

		AuthResponse response = authService.registerUser(request);

		return ResponseEntity.ok(ApiResponse.success("User registered successfully", response));
	}

	// ======================
	// MERCHANT REGISTER
	// ======================
	@PostMapping("/merchant/register")
	public ResponseEntity<ApiResponse<AuthResponse>> registerMerchant(@RequestBody MerchantRegisterRequest request) 
	{

		otpService.verifyOtp(request.email(), request.otp(), OTPType.REGISTER);

		AuthResponse response = authService.registerMerchant(request);

		return ResponseEntity.ok(ApiResponse.success("Merchant registered successfully", response));
	}

	// ======================
	// LOGIN
	// ======================
	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) 
	{

		AuthResponse response = authService.login(request);

		return ResponseEntity.ok(ApiResponse.success("Login successful", response));
	}

	// ======================
	// FORGOT PASSWORD OTP
	// ======================
	@PostMapping("/forgot-password")
	public ResponseEntity<ApiResponse<?>> forgotPassword(@RequestBody OtpRequest request) 
	{

		authService.sendForgotPasswordOtp(request.email());

		return ResponseEntity.ok(ApiResponse.success("OTP sent", null));
	}
	
	@PostMapping("/reset-password")
	public ResponseEntity<ApiResponse<?>> resetPassword(@RequestBody ResetPasswordRequest request) 
	{

		authService.resetPassword(request);

		return ResponseEntity.ok(ApiResponse.success("Password reset successful", null));
	}
}