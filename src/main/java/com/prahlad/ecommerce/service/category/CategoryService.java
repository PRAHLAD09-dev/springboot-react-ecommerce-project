package com.prahlad.ecommerce.service.category;

import java.util.List;

import org.springframework.stereotype.Service;
import com.prahlad.ecommerce.dto.category.CategoryResponse;
import com.prahlad.ecommerce.entity.Category;
import com.prahlad.ecommerce.exception.BadRequestException;
import com.prahlad.ecommerce.repository.CategoryRepository;
import com.prahlad.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService 
{

	private final CategoryRepository categoryRepository;
	private final ProductRepository productRepository;

	// ================= CREATE =================
	public CategoryResponse createCategory(String name) 
	{

		Category category = new Category();
		category.setName(name);

		Category saved = categoryRepository.save(category);

		return mapToDTO(saved);
	}

	// ================= GET ALL =================
	public List<CategoryResponse> getAllCategories() 
	{

		return categoryRepository.findAll().stream().map(this::mapToDTO).toList();
	}

	// ================= DELETE =================
	public void deleteCategory(Long id) 
	{

		if (!categoryRepository.existsById(id)) 
		{
			throw new BadRequestException("Category not found");
		}

		if (productRepository.existsByCategoryId(id)) 
		{
			throw new BadRequestException("Category contains products");
		}

		categoryRepository.deleteById(id);
	}

	// ================= MAPPER =================
	private CategoryResponse mapToDTO(Category category) 
	{
		return new CategoryResponse(category.getId(), category.getName());
	}
}