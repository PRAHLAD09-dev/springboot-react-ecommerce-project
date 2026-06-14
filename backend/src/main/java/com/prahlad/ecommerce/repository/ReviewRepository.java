package com.prahlad.ecommerce.repository;

import com.prahlad.ecommerce.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> 
{

    List<Review> findByProductId(Long productId);

    Optional<Review> findByUserIdAndProductId(
            Long userId,
            Long productId
    );
    
    boolean existsByUserIdAndProductId(
            Long userId,
            Long productId
    );
}