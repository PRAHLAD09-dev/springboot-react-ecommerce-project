package com.prahlad.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prahlad.ecommerce.entity.Order;
import com.prahlad.ecommerce.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> 
{

    boolean existsByOrder(Order order);

}