package com.prahlad.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.prahlad.ecommerce.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> 
{

    List<Order> findByUserId(Long userId);
    
	@Query("""
			SELECT DISTINCT o FROM Order o
			JOIN o.orderItems oi
			JOIN oi.product p
			WHERE p.merchant.id = :merchantId
			""")
	List<Order> findOrdersByMerchantId(Long merchantId);

}