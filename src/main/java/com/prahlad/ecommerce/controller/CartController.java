package com.prahlad.ecommerce.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.cart.CartResponse;
import com.prahlad.ecommerce.service.cart.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class CartController 
{

	private final CartService cartService;

	@PostMapping("/add")
	public ApiResponse<CartResponse> addToCart(@RequestParam Long productId, @RequestParam int quantity,
			Authentication auth) 
	{

		return ApiResponse.success("Product added to cart", cartService.addToCart(productId, quantity, auth.getName()));
	}

	@PutMapping("/update/{cartItemId}")
	public ApiResponse<CartResponse> updateQuantity(@PathVariable Long cartItemId, @RequestParam int quantity,
			Authentication auth) 
	{

		return ApiResponse.success("Cart updated", cartService.updateQuantity(cartItemId, quantity, auth.getName()));
	}

	@DeleteMapping("/remove/{cartItemId}")
	public ApiResponse<CartResponse> removeItem(@PathVariable Long cartItemId, Authentication auth) 
	{

		return ApiResponse.success("Item removed from cart", cartService.removeItem(cartItemId, auth.getName()));
	}

	@GetMapping
	public ApiResponse<CartResponse> viewCart(Authentication auth) 
	{

		return ApiResponse.success("Cart fetched", cartService.getUserCart(auth.getName()));
	}
}