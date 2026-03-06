package com.prahlad.ecommerce.service.auth;

import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.auth.AuthResponse;
import com.prahlad.ecommerce.dto.auth.LoginRequest;
import com.prahlad.ecommerce.dto.auth.MerchantRegisterRequest;
import com.prahlad.ecommerce.dto.auth.UserRegisterRequest;

@Service
public interface AuthService 
{

    AuthResponse registerUser(UserRegisterRequest request);

    AuthResponse registerMerchant(MerchantRegisterRequest request);

    AuthResponse login(LoginRequest request);
}