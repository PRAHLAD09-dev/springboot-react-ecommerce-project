package com.prahlad.ecommerce.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prahlad.ecommerce.dto.order.OrderResponse;
import com.prahlad.ecommerce.entity.Order;
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
		public OrderResponse updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus status,
				Authentication authentication) 
		{
			String email = authentication.getName();

			return orderService.updateOrderStatus(orderId, status, email);
		}
	}
