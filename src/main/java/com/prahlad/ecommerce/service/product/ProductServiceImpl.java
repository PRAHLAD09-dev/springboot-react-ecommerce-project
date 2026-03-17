package com.prahlad.ecommerce.service.product;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.prahlad.ecommerce.dto.product.ProductRequest;
import com.prahlad.ecommerce.dto.product.ProductResponse;
import com.prahlad.ecommerce.entity.Category;
import com.prahlad.ecommerce.entity.Merchant;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.repository.CategoryRepository;
import com.prahlad.ecommerce.repository.MerchantRepository;
import com.prahlad.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService 
{

	private final ProductRepository productRepository;
	private final MerchantRepository merchantRepository;
	private final CategoryRepository categoryRepository;

	@Override
	public ProductResponse addProduct(ProductRequest request, String merchantEmail) 
	{

		Merchant merchant = merchantRepository.findByEmail(merchantEmail)
				.orElseThrow(() -> new RuntimeException("Merchant not found"));

		Category category = categoryRepository.findById(request.categoryId())
				.orElseThrow(() -> new RuntimeException("Category not found"));

		Product product = new Product();
		product.setName(request.name());
		product.setDescription(request.description());
		product.setPrice(request.price());
		product.setStock(request.stock());
		product.setMerchant(merchant);
		product.setCategory(category);
		product.setActive(true);

		Product saved = productRepository.save(product);

		return mapToDTO(saved);
	}

	@Override
	public ProductResponse updateProduct(Long productId, ProductRequest request, String merchantEmail) 
	{

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		if (!product.getMerchant().getEmail().equals(merchantEmail)) 
		{
			throw new RuntimeException("Unauthorized");
		}

		product.setName(request.name());
		product.setDescription(request.description());
		product.setPrice(request.price());
		product.setStock(request.stock());

		Product updated = productRepository.save(product);

		return mapToDTO(updated);
	}


	@Override
	public void deleteProduct(Long productId, String merchantEmail) 
	{

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		if (!product.getMerchant().getEmail().equals(merchantEmail)) 
		{
			throw new RuntimeException("Unauthorized");
		}

		productRepository.delete(product);
	}

	@Override
	public List<ProductResponse> getMyProducts(String merchantEmail) 
	{

		Merchant merchant = merchantRepository.findByEmail(merchantEmail)
				.orElseThrow(() -> new RuntimeException("Merchant not found"));

		return productRepository.findByMerchantId(merchant.getId()).stream().map(this::mapToDTO).toList();
	}


	@Override
	public Page<ProductResponse> getAllProducts(int page, int size, String sortBy) 
	{

		Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

		return productRepository.findByActiveTrue(pageable).map(this::mapToDTO);
	}


	@Override
	public Page<ProductResponse> searchProducts(String keyword, int page, int size) 
	{

		Pageable pageable = PageRequest.of(page, size);
		return productRepository.findByNameContainingIgnoreCaseAndActiveTrue(keyword, pageable).map(this::mapToDTO);
	}

	@Override
	public Page<ProductResponse> getProductsByCategory(Long categoryId, int page, int size) 
	{

		Pageable pageable = PageRequest.of(page, size);

		return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable).map(this::mapToDTO);
	}

	private ProductResponse mapToDTO(Product product) 
	{
		return new ProductResponse(product.getId(), product.getName(), product.getDescription(), product.getPrice(),
				product.getStock(), product.getCategory().getName(), product.getMerchant().getBusinessName());
	}
}