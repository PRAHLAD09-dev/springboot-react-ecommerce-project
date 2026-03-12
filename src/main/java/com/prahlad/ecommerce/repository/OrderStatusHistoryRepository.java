package com.prahlad.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.entity.OrderStatusHistory;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long> 
{

    List<OrderStatusHistory> findByOrderOrderByUpdatedAtAsc(Order order);
}