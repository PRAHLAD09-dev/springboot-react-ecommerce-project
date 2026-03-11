package com.prahlad.ecommerce.service.payment;

import org.springframework.stereotype.Service;
import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.entity.Payment;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.enums.PaymentStatus;
import com.prahlad.ecommerce.repository.OrderRepository;
import com.prahlad.ecommerce.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService 
{

	private final PaymentRepository paymentRepository;
	private final OrderRepository orderRepository;

	public Payment makePayment(Long orderId, String email) 
	{

		Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

		if (!order.getUser().getEmail().equals(email)) 
		{
			throw new RuntimeException("You cannot pay for this order");
		}

		if (paymentRepository.existsByOrder(order)) 
		{
			throw new RuntimeException("Payment already completed");
		}

		if (order.getStatus() != OrderStatus.CONFIRMED) 
		{
			throw new RuntimeException("Order not confirmed yet");
		}

		Payment payment = new Payment();

		payment.setOrder(order);
		payment.setAmount(order.getTotalPrice());
		payment.setStatus(PaymentStatus.SUCCESS);
		payment.setTransactionId("TXN_" + System.currentTimeMillis());

		order.setPaid(true);

		orderRepository.save(order);

		return paymentRepository.save(payment);
	}
}