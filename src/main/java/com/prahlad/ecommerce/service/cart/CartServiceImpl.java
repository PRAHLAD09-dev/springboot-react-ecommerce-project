package com.prahlad.ecommerce.service.cart;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.prahlad.ecommerce.dto.cart.CartItemDTO;
import com.prahlad.ecommerce.dto.cart.CartResponse;
import com.prahlad.ecommerce.entity.Cart;
import com.prahlad.ecommerce.entity.CartItem;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.entity.User;
import com.prahlad.ecommerce.exception.BadRequestException;
import com.prahlad.ecommerce.exception.ResourceNotFoundException;
import com.prahlad.ecommerce.exception.UnauthorizedException;
import com.prahlad.ecommerce.repository.CartItemRepository;
import com.prahlad.ecommerce.repository.CartRepository;
import com.prahlad.ecommerce.repository.ProductRepository;
import com.prahlad.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService 
{

	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;
	private final UserRepository userRepository;

	// ================= ADD =================
	@Override
	public CartResponse addToCart(Long productId, int quantity, String userEmail) 
	{
		User user = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		Cart cart = cartRepository.findByUser(user).orElseGet(() -> 
		{
			Cart newCart = new Cart();
			newCart.setUser(user);
			return cartRepository.save(newCart);
		});

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		if (!product.isActive()) 
		{
			throw new ResourceNotFoundException("Product not available");
		}

		if (product.getStock() < quantity) 
		{
			throw new BadRequestException("Insufficient stock");
		}

		Optional<CartItem> existingItem = cart.getItems().stream().filter(i -> i.getProduct().getId().equals(productId))
				.findFirst();

		if (existingItem.isPresent()) 
		{

			CartItem item = existingItem.get();
			int newQty = item.getQuantity() + quantity;

			if (product.getStock() < newQty) 
			{
				throw new BadRequestException("Insufficient stock");
			}

			item.setQuantity(newQty);
			item.setPrice(product.getPrice() * newQty);

		} 
		
		else 
		{
			CartItem item = new CartItem();
			item.setCart(cart);
			item.setProduct(product);
			item.setQuantity(quantity);
			item.setPrice(product.getPrice() * quantity);

			cart.getItems().add(item);
		}

		Cart saved = cartRepository.save(cart);
		return mapToDTO(saved);
	}

	// ================= UPDATE =================
	@Override
	public CartResponse updateQuantity(Long cartItemId, int quantity, String userEmail) 
	{

		CartItem item = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

		if (!item.getCart().getUser().getEmail().equals(userEmail)) 
		{
			throw new UnauthorizedException("Unauthorized access");
		}

		Product product = item.getProduct();

		if (product.getStock() < quantity) 
		{
			throw new BadRequestException("Insufficient stock");
		}

		item.setQuantity(quantity);
		item.setPrice(product.getPrice() * quantity);

		cartItemRepository.save(item);

		return mapToDTO(item.getCart());
	}

	// ================= REMOVE =================
	@Override
	public CartResponse removeItem(Long cartItemId, String userEmail) 
	{
		CartItem item = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

		if (!item.getCart().getUser().getEmail().equals(userEmail)) 
		{
			throw new UnauthorizedException("Unauthorized access");
		}

		Cart cart = item.getCart();

		cart.getItems().remove(item);
		cartItemRepository.delete(item);

		return mapToDTO(cart);
	}

	// ================= GET =================
	@Override
	public CartResponse getUserCart(String userEmail) 
	{

		User user = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		Cart cart = cartRepository.findByUser(user).orElseThrow(() -> new ResourceNotFoundException("Cart is empty"));

		return mapToDTO(cart);
	}

	// ================= MAPPER =================
	private CartResponse mapToDTO(Cart cart) 
	{

        List<CartItemDTO> items = cart.getItems().stream()
                .map(i -> new CartItemDTO(
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getQuantity(),
                        i.getPrice()
                ))
                .toList();

        double total = items.stream()
                .mapToDouble(i -> i.price())
                .sum();

        return new CartResponse(
                cart.getId(),
                items,
                total
        );
    }
}
