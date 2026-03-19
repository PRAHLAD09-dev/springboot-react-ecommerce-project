package com.prahlad.ecommerce.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.order.OrderResponse;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.service.Order.OrderService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController 
{
	 private final OrderService orderService;

		@PutMapping("/{orderId}/status")
		public ApiResponse<OrderResponse> updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus status,
				Authentication auth) 
		{

			return ApiResponse.success("Order status updated",
					orderService.updateOrderStatus(orderId, status, auth.getName()));
		}

	}
