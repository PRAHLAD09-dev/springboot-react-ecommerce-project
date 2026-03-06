package com.prahlad.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prahlad.ecommerce.dto.auth.AuthResponse;
import com.prahlad.ecommerce.dto.auth.LoginRequest;
import com.prahlad.ecommerce.dto.auth.MerchantRegisterRequest;
import com.prahlad.ecommerce.dto.auth.UserRegisterRequest;
import com.prahlad.ecommerce.service.auth.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController 
{

    private final AuthService authService;

    @PostMapping("/user/register")
    public ResponseEntity<AuthResponse> registerUser( @RequestBody UserRegisterRequest request) 
    {

        return ResponseEntity.ok(authService.registerUser(request));
    }

    @PostMapping("/merchant/register")
    public ResponseEntity<AuthResponse> registerMerchant(@RequestBody MerchantRegisterRequest request) 
    {

        return ResponseEntity.ok(authService.registerMerchant(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login( @RequestBody LoginRequest request) 
    {

        return ResponseEntity.ok(authService.login(request));
    }
}