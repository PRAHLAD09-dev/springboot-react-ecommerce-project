package com.prahlad.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prahlad.ecommerce.entity.Cart;
import com.prahlad.ecommerce.entity.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> 
{

    Optional<Cart> findByUser(User user);

}
