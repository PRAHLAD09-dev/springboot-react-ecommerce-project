package com.prahlad.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.enums.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> 
{

    List<Order> findByUserId(Long userId);
    Optional<Order> findByIdAndUserEmail(Long id, String email);
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
    
	@Query("""
			SELECT DISTINCT o FROM Order o
			JOIN o.orderItems oi
			JOIN oi.product p
			WHERE p.merchant.id = :merchantId
			""")
	List<Order> findOrdersByMerchantId(Long merchantId);

}