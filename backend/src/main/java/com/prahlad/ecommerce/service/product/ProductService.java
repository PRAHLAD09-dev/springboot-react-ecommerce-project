package com.prahlad.ecommerce.service.product;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.prahlad.ecommerce.dto.product.ProductRequest;
import com.prahlad.ecommerce.dto.product.ProductResponse;

public interface ProductService 
{

	ProductResponse addProduct(
	        ProductRequest request,
	        MultipartFile[] files
	);

	public ProductResponse updateProduct(
            Long productId,
            ProductRequest request,
            MultipartFile[] files
    );
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

