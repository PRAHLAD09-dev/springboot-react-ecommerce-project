package com.prahlad.ecommerce.service.product;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.product.ProductRequest;
import com.prahlad.ecommerce.dto.product.ProductResponse;

@Service
public interface ProductService 
{

	ProductResponse addProduct(ProductRequest request, String imageUrl, String merchantEmail);

	ProductResponse updateProduct(Long productId, ProductRequest request, String imageUrl, String merchantEmail);

	 void deleteProduct(Long productId, String merchantEmail);

     List<ProductResponse> getMyProducts(String merchantEmail);
       
     Page<ProductResponse> getProducts(
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

