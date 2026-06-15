package com.prahlad.ecommerce.service.Review;

import com.prahlad.ecommerce.dto.review.ReviewResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ReviewService
{

    ReviewResponse addReview(
            Long productId,
            String email,
            Integer rating,
            String comment,
            MultipartFile[] images
    );
    
    List<ReviewResponse> getProductReviews(
            Long productId
    );
}