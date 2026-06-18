package com.prahlad.ecommerce.dto.payment;

import java.time.LocalDateTime;

import com.prahlad.ecommerce.enums.PaymentStatus;

public record PaymentResponse(
	    Long paymentId,
	    Long orderId,
	    double amount,
	    PaymentStatus status,
	    String transactionId,
	    LocalDateTime paidAt
	)
	{}