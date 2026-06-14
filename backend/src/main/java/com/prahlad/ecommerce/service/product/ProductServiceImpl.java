package com.prahlad.ecommerce.service.product;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prahlad.ecommerce.dto.ai.AIProductResponse;
import com.prahlad.ecommerce.dto.product.ProductRequest;
import com.prahlad.ecommerce.dto.product.ProductResponse;
import com.prahlad.ecommerce.entity.Category;
import com.prahlad.ecommerce.entity.Merchant;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.entity.ProductImage;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.exception.UnauthorizedException;
import com.prahlad.ecommerce.repository.CategoryRepository;
import com.prahlad.ecommerce.repository.MerchantRepository;
import com.prahlad.ecommerce.repository.ProductRepository;
import com.prahlad.ecommerce.repository.UserRepository;
import com.prahlad.ecommerce.service.ai.GeminiService;

import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService 
{

    private final ProductRepository productRepository;
    private final MerchantRepository merchantRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    // =========================
    // GET LOGGED IN MERCHANT
    // =========================
    private Merchant getCurrentMerchant() 
    {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Merchant merchant = merchantRepository.findByUser(user)
                .orElseThrow(() -> new UnauthorizedException("Not a merchant"));

        if (!merchant.isApproved()) 
        {
            throw new UnauthorizedException("Merchant not approved");
        }

        if (!merchant.isActive()) 
        {
            throw new UnauthorizedException("Merchant blocked");
        }

        return merchant;
    }

    @Override
    @Transactional
    public ProductResponse addProduct(
            ProductRequest request,
            List<String> imageUrls
    )
    {
    	if (imageUrls == null || imageUrls.isEmpty())
    	{
    	    throw new IllegalArgumentException(
    	            "At least one product image is required"
    	    );
    	}

        if (request.price() == null || request.price() <= 0)
        {
            throw new IllegalArgumentException("Invalid price");
        }

        if (request.categoryId() == null)
        {
            throw new IllegalArgumentException("Category required");
        }

        if (imageUrls == null || imageUrls.isEmpty())
        {
            throw new IllegalArgumentException("Product images required");
        }

        Merchant merchant = getCurrentMerchant();

        Category category = categoryRepository.findById(
                request.categoryId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Category not found"
                ));

        AIProductResponse ai =
                geminiService.generateProductContent(
                        imageUrls,
                        category.getName()
                );

        Product product = new Product();

        product.setName(
                ai.productName()
        );

        product.setDescription(
                ai.aiDescription()
        );

        product.setAiDescription(
                ai.aiDescription()
        );

        try
        {
            product.setSpecificationsJson(
                    objectMapper.writeValueAsString(
                            ai.specifications()
                    )
            );

            product.setFeatureHighlightsJson(
                    objectMapper.writeValueAsString(
                            ai.featureHighlights()
                    )
            );
        }
        catch (Exception e)
        {
            throw new RuntimeException(e);
        }

        product.setSeoKeywords(
                String.join(
                        ",",
                        ai.seoKeywords()
                )
        );

        product.setPrice(
                request.price()
        );

        product.setStock(
                request.stock() != null
                        ? request.stock()
                        : 0
        );

        product.setActive(true);

        product.setMerchant(
                merchant
        );

        product.setCategory(
                category
        );

        for (String url : imageUrls)
        {
            ProductImage image = new ProductImage();

            image.setImageUrl(url);
            image.setProduct(product);

            product.getImages().add(image);
        }

        Product saved =
                productRepository.save(product);

        return mapToDTO(saved);
    }
    
    @Override
    @Transactional
    public ProductResponse updateProduct(
            Long productId,
            ProductRequest request,
            List<String> imageUrls
    )
    {

        Merchant merchant =
                getCurrentMerchant();

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found"
                                ));

        if (!product.getMerchant()
                .getId()
                .equals(merchant.getId()))
        {
            throw new UnauthorizedException(
                    "Not your product"
            );
        }

        Category category =
                categoryRepository.findById(
                        request.categoryId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"
                        ));

        product.setPrice(
                request.price()
        );

        product.setStock(
                request.stock()
        );

        product.setCategory(
                category
        );

        if (imageUrls != null &&
                !imageUrls.isEmpty())
        {

            AIProductResponse ai =
                    geminiService.generateProductContent(
                            imageUrls,
                            category.getName()
                    );

            product.setName(
                    ai.productName()
            );

            product.setDescription(
                    ai.aiDescription()
            );

            product.setAiDescription(
                    ai.aiDescription()
            );

            try
            {
                product.setSpecificationsJson(
                        objectMapper.writeValueAsString(
                                ai.specifications()
                        )
                );

                product.setFeatureHighlightsJson(
                        objectMapper.writeValueAsString(
                                ai.featureHighlights()
                        )
                );
            }
            catch (Exception e)
            {
                throw new RuntimeException(e);
            }

            product.setSeoKeywords(
                    String.join(
                            ",",
                            ai.seoKeywords()
                    )
            );

            product.getImages().clear();

            for (String url : imageUrls)
            {
                ProductImage image =
                        new ProductImage();

                image.setImageUrl(url);
                image.setProduct(product);

                product.getImages().add(image);
            }
        }

        return mapToDTO(
                productRepository.save(product)
        );
    }
    
    // =========================
    // DELETE PRODUCT
    // =========================
    @Override
    @Transactional
    public void deleteProduct(Long productId) 
    {

        Merchant merchant = getCurrentMerchant();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getMerchant().getId().equals(merchant.getId())) 
        {
            throw new UnauthorizedException("Unauthorized");
        }

        productRepository.delete(product);
    }

    // =========================
    // GET MY PRODUCTS
    // =========================
    @Override
    public List<ProductResponse> getMyProducts() 
    {

        Merchant merchant = getCurrentMerchant();

        return productRepository.findByMerchantId(merchant.getId())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // =========================
    // GET ALL PRODUCTS (FILTER)
    // =========================
    @Override
    public Page<ProductResponse> getProducts(
            int page,
            int size,
            String sortBy,
            String keyword,
            Long categoryId,
            Double minPrice,
            Double maxPrice
    ) 
    {
    	Sort sort = Sort.by("id");
        if (sortBy != null && !sortBy.isBlank()) 
        {
            sort = Sort.by(sortBy).ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Product> spec = (root, query, cb) -> 
        {

            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) 
            {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("name")),
                                "%" + keyword.toLowerCase() + "%"
                        )
                );
            }

            if (categoryId != null) 
            {
                predicates.add(
                        cb.equal(root.get("category").get("id"), categoryId)
                );
            }

            if (minPrice != null) 
            {
                predicates.add(
                        cb.greaterThanOrEqualTo(root.get("price"), minPrice)
                );
            }

            if (maxPrice != null) 
            {
                predicates.add(
                        cb.lessThanOrEqualTo(root.get("price"), maxPrice)
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, pageable)
                .map(this::mapToDTO);
    }

    // =========================
    // GET BY ID
    // =========================
    @Override
    public ProductResponse getProductById(Long id) 
    {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return mapToDTO(product);
    }

    // =========================
    // DTO MAPPING
    // =========================
    private ProductResponse mapToDTO(Product product)
    {
        String merchantName = null;

        if (product.getMerchant() != null)
        {
            merchantName =
                    product.getMerchant()
                           .getBusinessName();
        }

        String categoryName = null;

        if (product.getCategory() != null)
        {
            categoryName =
                    product.getCategory()
                           .getName();
        }

        List<String> imageUrls =
                product.getImages()
                        .stream()
                        .map(ProductImage::getImageUrl)
                        .toList();

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),

                product.getAiDescription(),
                product.getSpecificationsJson(),
                product.getFeatureHighlightsJson(),
                product.getSeoKeywords(),

                product.getPrice(),
                product.getStock(),

                product.getAverageRating(),
                product.getTotalReviews(),

                categoryName,
                merchantName,
                imageUrls
        );
    }
}
