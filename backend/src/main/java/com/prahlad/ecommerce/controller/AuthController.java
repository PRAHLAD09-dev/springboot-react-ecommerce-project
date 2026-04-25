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

import jakarta.validation.Valid;
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
	public ResponseEntity<ApiResponse<AuthResponse>> registerUser(@Valid @RequestBody UserRegisterRequest request) 
	{

		otpService.verifyOtp(request.email(), request.otp(), OTPType.REGISTER);

		AuthResponse response = authService.registerUser(request);

		return ResponseEntity.ok(ApiResponse.success("User registered successfully", response));
	}

	// ======================
	// MERCHANT REGISTER
	// ======================
	@PostMapping("/merchant/register")
	public ResponseEntity<ApiResponse<AuthResponse>> registerMerchant(@Valid @RequestBody MerchantRegisterRequest request) 
	{

		otpService.verifyOtp(request.email(), request.otp(), OTPType.REGISTER);

		AuthResponse response = authService.becomeMerchant(request);

		return ResponseEntity.ok(ApiResponse.success("Merchant registered successfully", response));
	}

	// ======================
	// LOGIN
	// ======================
	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) 
	{

		AuthResponse response = authService.login(request);

		return ResponseEntity.ok(ApiResponse.success("Login successful", response));
	}

	// ======================
	// FORGOT PASSWORD OTP
	// ======================
	@PostMapping("/forgot-password")
	public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody OtpRequest request) 
	{
		authService.sendForgotPasswordOtp(request);

		return ResponseEntity.ok(ApiResponse.success("If the email exists, OTP has been sent", null));
	}
	
	// ======================
	// RESET PASSWORD
	// ======================
	@PostMapping("/reset-password")
	public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) 
	{
		authService.resetPassword(request);

		return ResponseEntity.ok(ApiResponse.success("Password reset successful", null));
	}
}