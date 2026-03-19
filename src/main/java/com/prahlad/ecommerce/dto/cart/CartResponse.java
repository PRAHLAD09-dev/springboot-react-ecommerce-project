package com.prahlad.ecommerce.dto.cart;

import java.util.List;

public record CartResponse(
    Long cartId,
    List<CartItemDTO> items,
    double totalPrice
) {}