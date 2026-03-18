package com.prahlad.ecommerce.service.payment;

import org.springframework.stereotype.Service;
import com.prahlad.ecommerce.dto.payment.PaymentResponse;
import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.entity.Payment;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.enums.PaymentStatus;
import com.prahlad.ecommerce.exception.BadRequestException;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.exception.UnauthorizedException;
import com.prahlad.ecommerce.repository.OrderRepository;
import com.prahlad.ecommerce.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService 
{

	private final PaymentRepository paymentRepository;
	private final OrderRepository orderRepository;

	public PaymentResponse makePayment(Long orderId, String email) 
	{

		Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));

		if (!order.getUser().getEmail().equals(email)) 
		{
			throw new UnauthorizedException("You cannot pay for this order");
		}

		if (paymentRepository.existsByOrder(order)) 
		{
			throw new BadRequestException("Payment already completed");
		}

		if (order.getStatus() != OrderStatus.CONFIRMED) 
		{
			throw new BadRequestException("Order not confirmed yet");
		}

		Payment payment = new Payment();
		payment.setOrder(order);
		payment.setAmount(order.getTotalPrice());
		payment.setStatus(PaymentStatus.SUCCESS);
		payment.setTransactionId("TXN_" + System.currentTimeMillis());

		order.setPaid(true);
		orderRepository.save(order);

		Payment saved = paymentRepository.save(payment);

		return mapToDTO(saved);
	}

	private PaymentResponse mapToDTO(Payment payment) 
	{
		return new PaymentResponse(payment.getId(), payment.getOrder().getId(), payment.getAmount(),
				payment.getStatus(), payment.getTransactionId());
	}
}