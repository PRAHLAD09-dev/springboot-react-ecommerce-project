package com.prahlad.ecommerce.service.payment;

import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.payment.PaymentResponse;
import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.entity.Payment;
import com.prahlad.ecommerce.enums.NotificationType;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.enums.PaymentStatus;
import com.prahlad.ecommerce.exception.BadRequestException;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.exception.UnauthorizedException;
import com.prahlad.ecommerce.repository.OrderRepository;
import com.prahlad.ecommerce.repository.PaymentRepository;
import com.prahlad.ecommerce.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService 
{

	private final PaymentRepository paymentRepository;
	private final OrderRepository orderRepository;
	private final NotificationService notificationService;

	public PaymentResponse makePayment(Long orderId, String email) 
	{
	    Order order = orderRepository.findById(orderId)
	        .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

	    if (!order.getUser().getEmail().equals(email)) 
	    {
	        throw new UnauthorizedException("You cannot pay for this order");
	    }

	    if (paymentRepository.existsByOrder(order)) 
	    {
	        throw new BadRequestException("Payment already completed");
	    }

	
	    if (order.getStatus() != OrderStatus.CREATED) 
	    {
	        throw new BadRequestException("Invalid order state for payment");
	    }

	    Payment payment = new Payment();
	    payment.setOrder(order);
	    payment.setAmount(order.getTotalPrice());
	    payment.setStatus(PaymentStatus.SUCCESS);
	    payment.setTransactionId(generateTxnId());


	    order.setPaid(true);
	    order.setStatus(OrderStatus.CONFIRMED); 

	    orderRepository.save(order);
	    Payment savedPayment = paymentRepository.save(payment);

	    notificationService.sendNotification(
	        order.getUser().getEmail(),
	        "Payment Successful",
	        String.format("Payment of ₹%.0f received...", order.getTotalPrice()) +
	        " received for Order #" + order.getId(),
	        NotificationType.PAYMENT_SUCCESS
	    );

	    return mapToDTO(savedPayment);
	}

	private String generateTxnId() 
	{
		return "TXN_" + System.currentTimeMillis();
	}

	private PaymentResponse mapToDTO(Payment payment) 
	{
		return new PaymentResponse(payment.getId(), payment.getOrder().getId(), payment.getAmount(),
				payment.getStatus(), payment.getTransactionId());
	}
}