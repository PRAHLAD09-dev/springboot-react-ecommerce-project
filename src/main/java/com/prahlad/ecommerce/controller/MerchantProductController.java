package com.prahlad.ecommerce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prahlad.ecommerce.dto.auth.ProductRequest;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.service.product.ProductService;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/merchant")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantProductController 
{

	private final ProductService productService;

	private String getLoggedInMerchantEmail() 
	{
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}

	@GetMapping("/panel")
	public String merchantPanel() 
	{
		return "Merchant panel accessed";
	}

	@PostMapping("/add")
	public ResponseEntity<Product> addProduct(@Valid @RequestBody ProductRequest request )
    {

		return ResponseEntity.ok(productService.addProduct(request, getLoggedInMerchantEmail()));
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) 
	{

		Product product = productService.updateProduct(id, request, getLoggedInMerchantEmail());

		return ResponseEntity.ok(product);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable Long id) 
	{

		productService.deleteProduct(id, getLoggedInMerchantEmail());

		return ResponseEntity.ok("Product deleted successfully");
	}

	@GetMapping("/my-products")
	public ResponseEntity<List<Product>> getMyProducts() 
	{

		List<Product> products = productService.getMyProducts(getLoggedInMerchantEmail());

		return ResponseEntity.ok(products);
	}
}
