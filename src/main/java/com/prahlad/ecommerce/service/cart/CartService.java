package com.prahlad.ecommerce.service.cart;

import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.cart.CartResponse;

@Service
public interface CartService 
{

    CartResponse addToCart(Long productId, int quantity, String userEmail);

    CartResponse updateQuantity(Long cartItemId, int quantity, String userEmail);

    CartResponse removeItem(Long cartItemId, String userEmail);

    CartResponse getUserCart(String userEmail);

}
