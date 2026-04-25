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
import com.prahlad.ecommerce.dto.product.ProductRequest;
import com.prahlad.ecommerce.dto.product.ProductResponse;
import com.prahlad.ecommerce.entity.Category;
import com.prahlad.ecommerce.entity.Merchant;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.exception.UnauthorizedException;
import com.prahlad.ecommerce.repository.CategoryRepository;
import com.prahlad.ecommerce.repository.MerchantRepository;
import com.prahlad.ecommerce.repository.ProductRepository;
import com.prahlad.ecommerce.repository.UserRepository;

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

    // =========================
    // GET LOGGED IN MERCHANT
    // =========================
    private Merchant getCurrentMerchant() 
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return merchantRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));
    }

    // =========================
    // ADD PRODUCT
    // =========================
    @Override
    @Transactional
    public ProductResponse addProduct(ProductRequest request, String imageUrl) 
    {

        Merchant merchant = getCurrentMerchant();

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = new Product();
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setActive(true);
        product.setMerchant(merchant);
        product.setCategory(category);
        product.setImageUrl(imageUrl);

        return mapToDTO(productRepository.save(product));
    }

    // =========================
    // UPDATE PRODUCT
    // =========================
    @Override
    @Transactional
    public ProductResponse updateProduct(Long productId, ProductRequest request, String imageUrl) 
    {

        Merchant merchant = getCurrentMerchant();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getMerchant().getId().equals(merchant.getId())) {
            throw new UnauthorizedException("Not your product");
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setCategory(category);

        if (imageUrl != null) {
            product.setImageUrl(imageUrl);
        }

        return mapToDTO(productRepository.save(product));
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

        if (!product.getMerchant().getId().equals(merchant.getId())) {
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
            merchantName = product.getMerchant().getBusinessName();
        }

        String categoryName = null;

        if (product.getCategory() != null)
        {
            categoryName = product.getCategory().getName();
        }

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                categoryName,
                merchantName
        );
    }
}
