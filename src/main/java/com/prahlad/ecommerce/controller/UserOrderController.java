package com.prahlad.ecommerce.controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.entity.OrderStatusHistory;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.repository.UserRepository;
import com.prahlad.ecommerce.service.Order.OrderService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserOrderController 
{

	private final OrderService orderService;
	private final UserRepository userRepository;

	@PostMapping("/place")
	public Order placeOrder(Authentication authentication) 
	{

		String email = authentication.getName();

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return orderService.placeOrder(user);
	}

	@GetMapping("/my-orders")
	public List<Order> getUserOrders(@RequestParam(required = false) OrderStatus status,
			Authentication authentication) 
	{

		String email = authentication.getName();

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return orderService.getUserOrders(user, status);
	}

	@GetMapping("/{orderId}")
	public Order getOrder(@PathVariable Long orderId) 
	{

		return orderService.getOrderById(orderId);
	}

	@GetMapping("/{orderId}/tracking")
	public List<OrderStatusHistory> trackOrder(@PathVariable Long orderId, Authentication authentication) 
	{

		String email = authentication.getName();

		return orderService.getOrderTracking(orderId, email);
	}
	
}