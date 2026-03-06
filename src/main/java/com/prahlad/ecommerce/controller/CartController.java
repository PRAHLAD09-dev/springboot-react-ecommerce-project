package com.prahlad.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prahlad.ecommerce.entity.Cart;
import com.prahlad.ecommerce.service.cart.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class CartController 
{

    private final CartService cartService;

  
    private String getLoggedInUserEmail()
    {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestParam Long productId,
            @RequestParam int quantity)
    {

        Cart cart = cartService.addToCart(
                productId,
                quantity,
                getLoggedInUserEmail()
        );

        return ResponseEntity.ok(cart);
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<Cart> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestParam int quantity)
    {
        Cart cart = cartService.updateQuantity(
                cartItemId,
                quantity,
                getLoggedInUserEmail()
        );

        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Cart> removeItem( @PathVariable Long cartItemId)
    {
        Cart cart = cartService.removeItem(
                cartItemId,
                getLoggedInUserEmail()
        );

        return ResponseEntity.ok(cart);
    }

    @GetMapping
    public ResponseEntity<Cart> viewCart()
    {
        Cart cart = cartService.getUserCart(getLoggedInUserEmail());

        return ResponseEntity.ok(cart);
    }
}
