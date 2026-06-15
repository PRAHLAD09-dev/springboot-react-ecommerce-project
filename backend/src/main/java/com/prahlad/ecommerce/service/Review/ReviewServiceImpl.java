package com.prahlad.ecommerce.service.Review;

import com.prahlad.ecommerce.dto.review.ReviewResponse;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.entity.Review;
import com.prahlad.ecommerce.entity.ReviewImage;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.exception.BadRequestException;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.repository.OrderRepository;
import com.prahlad.ecommerce.repository.ProductRepository;
import com.prahlad.ecommerce.repository.ReviewImageRepository;
import com.prahlad.ecommerce.repository.ReviewRepository;
import com.prahlad.ecommerce.repository.UserRepository;
import com.prahlad.ecommerce.service.imageService.ImageService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService
{

    private final ReviewRepository reviewRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ImageService imageService;

    @Override
    public  ReviewResponse addReview(
            Long productId,
            String email,
            Integer rating,
            String comment,
            MultipartFile[] images
    )
    {

        if (rating == null || rating < 1 || rating > 5)
        {
            throw new BadRequestException(
                    "Rating must be between 1 and 5"
            );
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        ));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        boolean purchased =
        		orderRepository.hasPurchasedProduct(
        		        user.getId(),
        		        productId
                    );

        if (!purchased)
        {
            throw new BadRequestException(
                    "You can review only purchased products"
            );
        }

        reviewRepository.findByUserIdAndProductId(
                user.getId(),
                productId
        )
             .ifPresent(r ->
                {
                    throw new BadRequestException(
                            "You already reviewed this product"
                    );
                });

        Review review = Review.builder()
                .rating(rating)
                .comment(comment)
                .product(product)
                .user(user)
                .build();

        Review savedReview =
                reviewRepository.save(review);

        try
        {
            if (images != null && images.length > 0)
            {
                List<String> imageUrls =
                        imageService.uploadImages(images);

                for (String imageUrl : imageUrls)
                {
                    ReviewImage reviewImage =
                            ReviewImage.builder()
                                    .imageUrl(imageUrl)
                                    .review(savedReview)
                                    .build();

                    reviewImageRepository.save(reviewImage);
                }
            }
        }
        catch (IOException e)
        {
            throw new BadRequestException(
                    "Failed to upload review images"
            );
        }

        return mapToResponse(savedReview);
    }

    @Override
    public List<ReviewResponse> getProductReviews(
            Long productId
    )
    {

        productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        ));

        return reviewRepository.findByProductId(productId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ReviewResponse mapToResponse(
            Review review
    )
    {

        List<String> imageUrls =
                review.getImages()
                        .stream()
                        .map(ReviewImage::getImageUrl)
                        .toList();

        return new ReviewResponse(
                review.getId(),
                review.getUser().getId(),
                review.getUser().getName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt(),
                imageUrls
        );
    }
}