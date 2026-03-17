package com.prahlad.ecommerce.dto.payment;

import com.prahlad.ecommerce.enums.PaymentStatus;

public record PaymentResponse(
        Long paymentId,
        Long orderId,
        double amount,
        PaymentStatus status,
        String transactionId
) {}