package com.prahlad.ecommerce.service.product;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.product.ProductRequest;
import com.prahlad.ecommerce.dto.product.ProductResponse;

@Service
public interface ProductService 
{

	 public ProductResponse addProduct(ProductRequest request, String imageUrl);

	 public ProductResponse updateProduct(Long productId, ProductRequest request, String imageUrl);

	 public void deleteProduct(Long productId);

	 public List<ProductResponse> getMyProducts() ;
       
	 public Page<ProductResponse> getProducts(
	            int page,
	            int size,
	            String sortBy,
	            String keyword,
	            Long categoryId,
	            Double minPrice,
	            Double maxPrice
	    );

     ProductResponse getProductById(Long id);
	
}

