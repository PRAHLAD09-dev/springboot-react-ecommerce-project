package com.prahlad.ecommerce.dto.payment;

import java.time.LocalDateTime;

import com.prahlad.ecommerce.enums.PaymentStatus;

public record PaymentSummaryDTO(
		
        String transactionId,
        PaymentStatus status,
        LocalDateTime paidAt,
        double amount
) {}