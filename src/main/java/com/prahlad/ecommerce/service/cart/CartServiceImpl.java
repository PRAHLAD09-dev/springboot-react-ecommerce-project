package com.prahlad.ecommerce.service.cart;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.prahlad.ecommerce.entity.Cart;
import com.prahlad.ecommerce.entity.CartItem;
import com.prahlad.ecommerce.entity.Product;
import com.prahlad.ecommerce.entity.User;
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

    @Override
    public Cart addToCart(Long productId, int quantity, String userEmail) 
    {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if(!product.isActive()){
            throw new RuntimeException("Product not available");
        }

        if(product.getStock() < quantity){
            throw new RuntimeException("Insufficient stock");
        }

        Optional<CartItem> existingItem = cart.getItems()
                .stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst();

        if(existingItem.isPresent()) 
        {

            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);

        } else {

            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setPrice(product.getPrice());

            cart.getItems().add(item);
        }

        return cartRepository.save(cart);
    }

    @Override
    public Cart updateQuantity(Long cartItemId, int quantity, String userEmail) 
    {

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if(item.getProduct().getStock() < quantity){
            throw new RuntimeException("Stock not available");
        }

        item.setQuantity(quantity);

        cartItemRepository.save(item);

        return item.getCart();
    }

    @Override
    public Cart removeItem(Long cartItemId, String userEmail) 
    {

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        Cart cart = item.getCart();

        cartItemRepository.delete(item);

        return cart;
    }

    @Override
    public Cart getUserCart(String userEmail) 
    {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart is empty"));
    }
}
