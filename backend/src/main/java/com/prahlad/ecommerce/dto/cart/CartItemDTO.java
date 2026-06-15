package com.prahlad.ecommerce.dto.cart;

public record CartItemDTO(
	    Long cartItemId,
	    Long productId,
	    String productName,
	    String imageUrl,
	    int quantity,
	    double price
	) {}