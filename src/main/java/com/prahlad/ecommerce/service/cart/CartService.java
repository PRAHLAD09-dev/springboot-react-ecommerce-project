package com.prahlad.ecommerce.service.cart;

import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.entity.Cart;

@Service
public interface CartService 
{

    Cart addToCart(Long productId, int quantity, String userEmail);

    Cart updateQuantity(Long cartItemId, int quantity, String userEmail);

    Cart removeItem(Long cartItemId, String userEmail);

    Cart getUserCart(String userEmail);

}
