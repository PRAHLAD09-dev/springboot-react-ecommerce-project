package com.prahlad.ecommerce.service.Order;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.enums.NotificationType;
import com.prahlad.ecommerce.enums.OrderStatus;
import com.prahlad.ecommerce.repository.OrderRepository;
import com.prahlad.ecommerce.service.notification.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderCleanupScheduler
{

    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

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

            notificationService.sendNotification(
                    order.getUser().getEmail(),
                    "Order Cancelled",
                    "Your order #" + order.getId()
                    + " was automatically cancelled because payment was not completed within 30 minutes.",
                    NotificationType.ORDER_CANCELLED
            );
        });

        orderRepository.saveAll(expiredOrders);
    }
}