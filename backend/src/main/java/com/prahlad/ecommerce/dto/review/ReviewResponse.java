package com.prahlad.ecommerce.dto.review;

import java.time.LocalDateTime;
import java.util.List;


public record ReviewResponse 
(
     Long reviewId,

     Long userId,

     String userName,

     Integer rating,

     String comment,

     LocalDateTime createdAt,

     List<String> images
    )
{}