package com.prahlad.ecommerce.service.product;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.auth.ProductRequest;
import com.prahlad.ecommerce.entity.Category;
import com.prahlad.ecommerce.entity.Merchant;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.repository.CategoryRepository;
import com.prahlad.ecommerce.repository.MerchantRepository;
import com.prahlad.ecommerce.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService
{

    private final ProductRepository productRepository;
    private final MerchantRepository merchantRepository;
    private final CategoryRepository categoryRepository;

    
  
    @Override
    public Product addProduct(ProductRequest request, String merchantEmail) 
    {

    	  System.out.println("Category ID = " + request.categoryId());
        Merchant merchant = merchantRepository.findByEmail(merchantEmail)
                .orElseThrow(() -> new RuntimeException("Merchant not found"));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        System.out.println("Category ID = " + request.categoryId());
        Product product = new Product();
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setMerchant(merchant);
        product.setCategory(category);
        product.setActive(true);

        return productRepository.save(product);
    }

  
    @Override
    public Product updateProduct(Long productId, ProductRequest request, String merchantEmail) 
    {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getMerchant().getEmail().equals(merchantEmail)) 
        {
            throw new RuntimeException("Unauthorized");
        }

        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStock(request.stock());

        return productRepository.save(product);
    }

    
    @Override
    public void deleteProduct(Long productId, String merchantEmail) 
    {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getMerchant().getEmail().equals(merchantEmail)) 
        {
            throw new RuntimeException("Unauthorized");
        }

        productRepository.delete(product);
    }

    @Override
    public List<Product> getMyProducts(String merchantEmail) 
    {

        Merchant merchant = merchantRepository.findByEmail(merchantEmail)
                .orElseThrow(() -> new RuntimeException("Merchant not found"));

        return productRepository.findByMerchantId(merchant.getId());
    }
   
        @Override
        public Page<Product> getAllProducts(int page, int size, String sortBy) 
        {

            Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

            return productRepository.findByActiveTrue(pageable);
        }

        @Override
        public Page<Product> searchProducts(String keyword, int page, int size) 
        {

            Pageable pageable = PageRequest.of(page, size);

            return productRepository
                    .findByNameContainingIgnoreCaseAndActiveTrue(keyword, pageable);
        }

        @Override
        public Page<Product> getProductsByCategory(Long categoryId, int page, int size) 
        {

            Pageable pageable = PageRequest.of(page, size);

            return productRepository
                    .findByCategoryIdAndActiveTrue(categoryId, pageable);
        }
    
}