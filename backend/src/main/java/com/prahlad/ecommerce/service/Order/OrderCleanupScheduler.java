package com.prahlad.ecommerce.service.Order;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.entity.OrderStatusHistory;
import com.prahlad.ecommerce.enums.NotificationType;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.repository.OrderRepository;
import com.prahlad.ecommerce.repository.OrderStatusHistoryRepository;
import com.prahlad.ecommerce.service.notification.NotificationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderCleanupScheduler
{

    private final OrderRepository orderRepository;
    private final NotificationService notificationService;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Transactional
    @Scheduled(fixedRate = 300000)
    public void cancelExpiredOrders()
    {

        LocalDateTime cutoff =
                LocalDateTime.now().minusMinutes(30);

        List<Order> expiredOrders =
                orderRepository.findByStatusAndCreatedAtBefore(
                        OrderStatus.CREATED,
                        cutoff
                );

        
        expiredOrders.forEach(order ->
        {

            order.setStatus(OrderStatus.CANCELLED);

            order.setCancelReason("PAYMENT_TIMEOUT");

            OrderStatusHistory history = new OrderStatusHistory();

            history.setOrder(order);

            history.setStatus(OrderStatus.CANCELLED);

            history.setUpdatedAt(
                    LocalDateTime.now()
            );

            history.setUpdatedBy("SYSTEM");

            orderStatusHistoryRepository.save(history);

            notificationService.sendNotification(
                    order.getUser().getEmail(),
                    "Order Cancelled",
                    "Your order #" + order.getId()
                    + " was automatically cancelled because payment was not completed within 30 minutes.",
                    NotificationType.ORDER_CANCELLED_PAYMENT_TIMEOUT
            );
            
            System.out.println(
            	    "Before = " + order.getStatus()
            	);

            	order.setStatus(OrderStatus.CANCELLED);

            	System.out.println(
            	    "After = " + order.getStatus()
            	);

        });
        
        

        orderRepository.saveAll(expiredOrders);
    }
}