package com.prahlad.ecommerce.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.payment.PaymentResponse;
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
	public ApiResponse<PaymentResponse> pay(@RequestParam Long orderId, Authentication auth) 
	{

		return ApiResponse.success("Payment successful", paymentService.makePayment(orderId, auth.getName()));
	}
}