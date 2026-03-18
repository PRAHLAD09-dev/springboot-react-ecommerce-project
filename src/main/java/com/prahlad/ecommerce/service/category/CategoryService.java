package com.prahlad.ecommerce.service.category;

import java.util.List;

import org.springframework.stereotype.Service;

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
    
    public Category createCategory(String name) 
    {

        Category category = new Category();
        category.setName(name);

        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() 
    {
        return categoryRepository.findAll();
    }

    public void deleteCategory(Long id) 
    {
    	if(productRepository.existsByCategoryId(id))
    	{
    	    throw new BadRequestException("Category contains products");
    	}
        categoryRepository.deleteById(id);
    }
}