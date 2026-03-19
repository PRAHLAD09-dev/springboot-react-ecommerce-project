package com.prahlad.ecommerce.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.order.OrderResponse;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.service.Order.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/merchant/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantOrderController 
{

	private final OrderService orderService;

	@PutMapping("/{orderId}/status")
	public ApiResponse<OrderResponse> updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus status,
			Authentication auth) 
	{

		return ApiResponse.success("Order status updated",
				orderService.updateOrderStatus(orderId, status, auth.getName()));
	}

	@GetMapping
	public ApiResponse<List<OrderResponse>> getMerchantOrders(Authentication auth) 
	{

		return ApiResponse.success("Merchant orders fetched", orderService.getMerchantOrders(auth.getName()));
	}
}