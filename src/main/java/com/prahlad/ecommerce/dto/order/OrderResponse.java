package com.prahlad.ecommerce.dto.order;

import java.util.List;
import com.prahlad.ecommerce.enums.OrderStatus;

public record OrderResponse(
        Long orderId,
        OrderStatus status,
        double totalPrice,
        boolean paid,
        List<OrderItemDTO> items
) {}