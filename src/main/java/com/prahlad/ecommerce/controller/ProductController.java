package com.prahlad.ecommerce.controller;

import org.springframework.web.bind.annotation.*;
import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.product.ProductResponse;
import com.prahlad.ecommerce.service.product.ProductService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController 
{

	private final ProductService productService;
	
	  @GetMapping
	    public ApiResponse<?> getProducts(
	            @RequestParam(defaultValue = "0") int page,
	            @RequestParam(defaultValue = "10") int size,
	            @RequestParam(defaultValue = "id") String sortBy,
	            @RequestParam(required = false) String keyword,
	            @RequestParam(required = false) Long categoryId,
	            @RequestParam(required = false) Double minPrice,
	            @RequestParam(required = false) Double maxPrice
	    ) 
	  {

	        return ApiResponse.success(
	                "Products fetched successfully",
	                productService.getProducts(page, size, sortBy, keyword, categoryId, minPrice, maxPrice)
	        );
	    }

	    @GetMapping("/{id}")
	    public ApiResponse<ProductResponse> getProductById(@PathVariable Long id) 
	    {

	        return ApiResponse.success(
	                "Product fetched successfully",
	                productService.getProductById(id)
	        );
	    }
}