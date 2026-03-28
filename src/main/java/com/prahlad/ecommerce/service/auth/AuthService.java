package com.prahlad.ecommerce.service.auth;

import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.auth.AuthResponse;
import com.prahlad.ecommerce.dto.auth.LoginRequest;
import com.prahlad.ecommerce.dto.auth.ResetPasswordRequest;
import com.prahlad.ecommerce.dto.merchant.MerchantRegisterRequest;
import com.prahlad.ecommerce.dto.user.UserRegisterRequest;

@Service
public interface AuthService 
{

    AuthResponse registerUser(UserRegisterRequest request);

    AuthResponse registerMerchant(MerchantRegisterRequest request);

    AuthResponse login(LoginRequest request);
    
     void resetPassword(ResetPasswordRequest request);

	 void sendForgotPasswordOtp(String email);
}