package com.prahlad.ecommerce.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prahlad.ecommerce.dto.payment.PaymentResponse;
import com.prahlad.ecommerce.entity.Payment;
import com.prahlad.ecommerce.service.payment.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class PaymentController 
{

    private final PaymentService paymentService;

	@PostMapping("/pay")
	public PaymentResponse pay(@RequestParam Long orderId, Authentication authentication) 
	{

		String email = authentication.getName();

		return paymentService.makePayment(orderId, email);
	}
}