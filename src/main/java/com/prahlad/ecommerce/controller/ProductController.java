package com.prahlad.ecommerce.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prahlad.ecommerce.dto.product.ProductResponse;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.service.product.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController 
{

	private final ProductService productService;

	@GetMapping
	public Page<ProductResponse> getAllProducts(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy) 
	{

		return productService.getAllProducts(page, size, sortBy);
	}

	@GetMapping("/search")
	public Page<ProductResponse> searchProducts(@RequestParam String keyword,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) 
	{

		return productService.searchProducts(keyword, page, size);
	}

	@GetMapping("/category/{categoryId}")
	public Page<ProductResponse> getProductsByCategory(@PathVariable Long categoryId,
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) 
	{

		return productService.getProductsByCategory(categoryId, page, size);
	}
}
