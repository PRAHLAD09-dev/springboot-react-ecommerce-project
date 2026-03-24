package com.prahlad.ecommerce.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.order.OrderResponse;
import com.prahlad.ecommerce.dto.order.OrderStatusHistoryDTO;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.service.Order.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserOrderController 
{

	private final OrderService orderService;

	@PostMapping("/place")
	public ApiResponse<OrderResponse> placeOrder(Authentication authentication) 
	{

		OrderResponse response = orderService.placeOrder(authentication.getName());

		return ApiResponse.success("Order placed successfully", response);
	}

	@GetMapping("/my-orders")
	public ApiResponse<List<OrderResponse>> getUserOrders(@RequestParam(required = false) OrderStatus status,
			Authentication authentication) 
	{

		List<OrderResponse> response = orderService.getUserOrders(authentication.getName(), status);

		return ApiResponse.success("Orders fetched successfully", response);
	}

	@GetMapping("/{orderId}")
	public ApiResponse<OrderResponse> getOrder(@PathVariable Long orderId, Authentication authentication) 
	{

		return ApiResponse.success("Order fetched successfully",
				orderService.getOrderById(orderId, authentication.getName()));
	}

	@GetMapping("/{orderId}/tracking")
	public ApiResponse<List<OrderStatusHistoryDTO>> trackOrder(@PathVariable Long orderId,
			Authentication authentication) 
	{

		List<OrderStatusHistoryDTO> response = orderService.getOrderTracking(orderId, authentication.getName());

		return ApiResponse.success("Order tracking fetched", response);
	}
}