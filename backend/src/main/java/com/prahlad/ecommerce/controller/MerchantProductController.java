package com.prahlad.ecommerce.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/merchant/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class MerchantProductController 
{

    private final ProductService productService;
    private final ImageService imageService;

    // ================= ADD PRODUCT =================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductResponse>> addProduct(
            @RequestPart("data") @Valid ProductRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file,
            Authentication auth
    ) throws IOException 
    {

        String imageUrl = uploadImageIfPresent(file);

        ProductResponse response =
                productService.addProduct(request, imageUrl);

        return ResponseEntity.ok(
                ApiResponse.success("Product added successfully", response)
        );
    }

    // ================= UPDATE PRODUCT =================
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @RequestPart("data") @Valid ProductRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file,
            Authentication auth
    ) throws IOException 
    {

        String imageUrl = uploadImageIfPresent(file);

        ProductResponse response =
                productService.updateProduct(id, request, imageUrl);

        return ResponseEntity.ok(
                ApiResponse.success("Product updated successfully", response)
        );
    }

    // ================= DELETE PRODUCT =================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(
            @PathVariable Long id,
            Authentication auth
    ) 
    {

        productService.deleteProduct(id);

        return ResponseEntity.ok(
                ApiResponse.success("Product deleted successfully", null)
        );
    }

    // ================= GET MY PRODUCTS =================
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getMyProducts(
            Authentication auth
    ) 
    {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Merchant products fetched",
                        productService.getMyProducts()
                )
        );
    }

    // ================= HELPER =================
    private String uploadImageIfPresent(MultipartFile file) throws IOException 
    {
        if (file != null && !file.isEmpty()) {
            return imageService.uploadImage(file);
        }
        return null;
    }
}