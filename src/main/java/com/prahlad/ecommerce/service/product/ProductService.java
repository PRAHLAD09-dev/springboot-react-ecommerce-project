package com.prahlad.ecommerce.service.product;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.dto.product.ProductRequest;
import com.prahlad.ecommerce.dto.product.ProductResponse;
import com.prahlad.ecommerce.entity.Product;

@Service
public interface ProductService 
{

	ProductResponse addProduct(ProductRequest request, String merchantEmail);

	 ProductResponse updateProduct(Long productId, ProductRequest request, String merchantEmail);

	  void deleteProduct(Long productId, String merchantEmail);

       List<ProductResponse> getMyProducts(String merchantEmail);
       
       Page<ProductResponse> getAllProducts(int page, int size, String sortBy);

       Page<ProductResponse> searchProducts(String keyword, int page, int size);

       Page<ProductResponse> getProductsByCategory(Long categoryId, int page, int size);
	
}

