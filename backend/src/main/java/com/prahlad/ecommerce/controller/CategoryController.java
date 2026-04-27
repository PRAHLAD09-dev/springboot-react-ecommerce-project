package com.prahlad.ecommerce.controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.prahlad.ecommerce.dto.apiresponce.ApiResponse;
import com.prahlad.ecommerce.dto.category.CategoryResponse;
import com.prahlad.ecommerce.service.category.CategoryService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController 
{

	private final CategoryService categoryService;

	@PostMapping
	public ApiResponse<CategoryResponse> createCategory(@RequestParam String name) 
	{

		return ApiResponse.success("Category created successfully", categoryService.createCategory(name));
	}

	@GetMapping
	public ApiResponse<List<CategoryResponse>> getAllCategories() 
	{

		return ApiResponse.success("Categories fetched successfully", categoryService.getAllCategories());
	}

	@DeleteMapping("/{id}")
	public ApiResponse<String> deleteCategory(@PathVariable Long id) 
	{

		categoryService.deleteCategory(id);

		return ApiResponse.success("Category deleted successfully", null);
	}
}