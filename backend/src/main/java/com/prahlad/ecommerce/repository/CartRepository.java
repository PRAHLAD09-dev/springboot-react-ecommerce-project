package com.prahlad.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.prahlad.ecommerce.entity.Cart;
import com.prahlad.ecommerce.entity.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> 
{

	@Query("SELECT c FROM Cart c LEFT JOIN FETCH c.items WHERE c.user = :user")
	Optional<Cart> findByUserWithItems(User user);

}
