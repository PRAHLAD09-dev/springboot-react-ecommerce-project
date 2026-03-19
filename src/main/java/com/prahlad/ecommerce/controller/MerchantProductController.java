package com.prahlad.ecommerce.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.product.ProductRequest;
import com.prahlad.ecommerce.dto.product.ProductResponse;
import com.prahlad.ecommerce.service.product.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/merchant/product")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantProductController 
{

	private final ProductService productService;

	@GetMapping("/panel")
	public ApiResponse<String> merchantPanel(Authentication auth) 
	{
		return ApiResponse.success("Merchant panel accessed", auth.getName());
	}

	@PostMapping("/add")
	public ApiResponse<ProductResponse> addProduct(@Valid @RequestBody ProductRequest request, Authentication auth) 
	{

		return ApiResponse.success("Product added successfully", productService.addProduct(request, auth.getName()));
	}

	@PutMapping("/update/{id}")
	public ApiResponse<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request,
			Authentication auth) {

		return ApiResponse.success("Product updated successfully",
				productService.updateProduct(id, request, auth.getName()));
	}

	@DeleteMapping("/delete/{id}")
	public ApiResponse<String> deleteProduct(@PathVariable Long id, Authentication auth) 
	{

		productService.deleteProduct(id, auth.getName());

		return ApiResponse.success("Product deleted successfully", null);
	}

	@GetMapping("/my-products")
	public ApiResponse<List<ProductResponse>> getMyProducts(Authentication auth) 
	{

		return ApiResponse.success("Merchant products fetched", productService.getMyProducts(auth.getName()));
	}
}