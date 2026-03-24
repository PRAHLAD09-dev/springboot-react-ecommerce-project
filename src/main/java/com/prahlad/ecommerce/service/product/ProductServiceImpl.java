package com.prahlad.ecommerce.service.product;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.prahlad.ecommerce.dto.product.ProductRequest;
import com.prahlad.ecommerce.dto.product.ProductResponse;
import com.prahlad.ecommerce.entity.Category;
import com.prahlad.ecommerce.entity.Merchant;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.exception.UnauthorizedException;
import com.prahlad.ecommerce.repository.CategoryRepository;
import com.prahlad.ecommerce.repository.MerchantRepository;
import com.prahlad.ecommerce.repository.ProductRepository;

import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService 
{

	private final ProductRepository productRepository;
	private final MerchantRepository merchantRepository;
	private final CategoryRepository categoryRepository;

	@Override
	@Transactional
	public ProductResponse addProduct(ProductRequest request, String imageUrl, String merchantEmail) 
	{

		Merchant merchant = merchantRepository.findByEmail(merchantEmail)
				.orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));

		Category category = categoryRepository.findById(request.categoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		Product product = new Product();
		product.setName(request.name());
		product.setDescription(request.description());
		product.setPrice(request.price());
		product.setStock(request.stock());
		product.setActive(true);

		product.setMerchant(merchant);
		product.setCategory(category);

		product.setImageUrl(imageUrl);

		Product saved = productRepository.save(product);

		return mapToDTO(saved);
	}

	@Override
	@Transactional
	public ProductResponse updateProduct(Long productId, ProductRequest request, String imageUrl,
			String merchantEmail) 
	{

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		if (!product.getMerchant().getEmail().equals(merchantEmail)) 
		{
			throw new UnauthorizedException("You are not allowed to update this product");
		}

		Category category = categoryRepository.findById(request.categoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		product.setName(request.name());
		product.setDescription(request.description());
		product.setPrice(request.price());
		product.setStock(request.stock());
		product.setCategory(category);

		if (imageUrl != null) 
		{
			product.setImageUrl(imageUrl);
		}

		Product updated = productRepository.save(product);

		return mapToDTO(updated);
	}

	@Override
	@Transactional
	public void deleteProduct(Long productId, String merchantEmail) 
	{

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		if (!product.getMerchant().getEmail().equals(merchantEmail)) 
		{
			throw new UnauthorizedException("Unauthorized");
		}

		productRepository.delete(product);
	}

	@Override
	public List<ProductResponse> getMyProducts(String merchantEmail) 
	{

		Merchant merchant = merchantRepository.findByEmail(merchantEmail)
				.orElseThrow(() -> new ResourceNotFoundException("Merchant not found"));

		return productRepository.findByMerchantId(merchant.getId()).stream().map(this::mapToDTO).toList();
	}

	@Override
	public Page<ProductResponse> getProducts(int page, int size, String sortBy, String keyword, Long categoryId,
			Double minPrice, Double maxPrice) 
	{

		Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

		Specification<Product> spec = (root, query, cb) -> 
		{

			List<Predicate> predicates = new ArrayList<>();

			if (keyword != null && !keyword.isBlank()) 
			{
				predicates.add(cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%"));
			}

			if (categoryId != null) 
			{
				predicates.add(cb.equal(root.get("category").get("id"), categoryId));
			}

			if (minPrice != null && maxPrice != null) 
			{
				predicates.add(cb.between(root.get("price"), minPrice, maxPrice));
			}

			return cb.and(predicates.toArray(new Predicate[0]));
		};

		Page<Product> products = productRepository.findAll(spec, pageable);

		return products.map(this::mapToDTO);
	}

	@Override
	public ProductResponse getProductById(Long id) 
	{

		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		return mapToDTO(product);
	}
 
	private ProductResponse mapToDTO(Product product) 
	{
	    return new ProductResponse(
	            product.getId(),
	            product.getName(),
	            product.getDescription(),
	            product.getPrice(),
	            product.getStock(),
	            product.getImageUrl(),
	            product.getCategory().getName(),
	            product.getMerchant().getBusinessName()
	    );
	}
}