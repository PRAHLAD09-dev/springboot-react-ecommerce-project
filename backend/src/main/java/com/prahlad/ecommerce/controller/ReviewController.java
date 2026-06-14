package com.prahlad.ecommerce.controller;

import com.prahlad.ecommerce.dto.review.ReviewResponse;
import com.prahlad.ecommerce.service.Review.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController
{

    private final ReviewService reviewService;

    // ================= ADD REVIEW WITH IMAGES =================

    @PostMapping(
            value = "/product/{productId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ReviewResponse addReview(

            @PathVariable Long productId,

            @RequestParam Long userId,

            @RequestParam Integer rating,

            @RequestParam(required = false)
            String comment,

            @RequestParam(required = false)
            MultipartFile[] images
    )
    {

        return reviewService.addReview(
                productId,
                userId,
                rating,
                comment,
                images
        );
    }

    // ================= GET PRODUCT REVIEWS =================

    @GetMapping("/product/{productId}")
    public List<ReviewResponse> getProductReviews(
            @PathVariable Long productId
    )
    {

        return reviewService.getProductReviews(productId);
    }
}