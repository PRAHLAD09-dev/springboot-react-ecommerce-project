package com.prahlad.ecommerce.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.product.ProductRequest;
import com.prahlad.ecommerce.dto.product.ProductResponse;
import com.prahlad.ecommerce.service.imageService.ImageService;
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
	private final ImageService imageService;

	@GetMapping("/panel")
	public ApiResponse<String> merchantPanel(Authentication auth) 
	{
		return ApiResponse.success("Merchant panel accessed", auth.getName());
	}

	@PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<ProductResponse> addProduct(@RequestPart("data") @Valid ProductRequest request,
			@RequestPart(value = "file", required = false) MultipartFile file, Authentication auth) throws IOException 
	{

		String imageUrl = null;

		if (file != null && !file.isEmpty()) 
		{
			imageUrl = imageService.uploadImage(file);
		}

		ProductResponse response = productService.addProduct(request, imageUrl, auth.getName());

		return ApiResponse.success("Product added successfully", response);
	}

	@PutMapping(value = "/update/{id}" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ApiResponse<ProductResponse> updateProduct(@PathVariable Long id,
			@RequestPart("data") @Valid ProductRequest request,
			@RequestPart(value = "file", required = false) MultipartFile file, Authentication auth) throws IOException 
	{

		String imageUrl = null;

		if (file != null && !file.isEmpty()) 
		{
			imageUrl = imageService.uploadImage(file);
		}

		ProductResponse response = productService.updateProduct(id, request, imageUrl, auth.getName());

		return ApiResponse.success("Product updated successfully", response);
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