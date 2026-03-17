package com.prahlad.ecommerce.dto.order;

import java.time.LocalDateTime;
import com.prahlad.ecommerce.enums.OrderStatus;

public record OrderStatusHistoryDTO(
        OrderStatus status,
        LocalDateTime updatedAt,
        String updatedBy
) {}