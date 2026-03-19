package com.prahlad.ecommerce.controller;

import org.springframework.data.domain.Page;
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
	public ApiResponse<Page<ProductResponse>> getAllProducts(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy) 
	{

		return ApiResponse.success("Products fetched successfully", productService.getAllProducts(page, size, sortBy));
	}

	@GetMapping("/search")
	public ApiResponse<Page<ProductResponse>> searchProducts(@RequestParam String keyword,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) 
	{

		return ApiResponse.success("Search results fetched", productService.searchProducts(keyword, page, size));
	}

	@GetMapping("/category/{categoryId}")
	public ApiResponse<Page<ProductResponse>> getProductsByCategory(@PathVariable Long categoryId,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) 
	{

		return ApiResponse.success("Category products fetched",
				productService.getProductsByCategory(categoryId, page, size));
	}
}